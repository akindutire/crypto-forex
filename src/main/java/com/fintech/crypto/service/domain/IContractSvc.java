package com.fintech.crypto.service.domain;

import com.fintech.crypto.contract.ContractCt;
import com.fintech.crypto.dao.*;
import com.fintech.crypto.dto.ContractWithHistoryDto;
import com.fintech.crypto.entity.*;
import com.fintech.crypto.enums.*;
import com.fintech.crypto.security.KeyGen;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IContractSvc implements ContractCt {

    @Autowired
    IUserSvc userSvc;

    @Autowired
    IWalletSvc walletSvc;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    TransactionDao transactionDao;

    @Autowired
    ContractDao contractDao;

    @Autowired
    ContractHistoryDao contractHistoryDao;

    @Autowired
    MineHistoryDao mineHistoryDao;

    @Autowired
    CoinDao coinDao;

    @Autowired
    FoldDao foldDao;

    @Autowired
    CryptoProviderAddressDao cryptoProviderAddressDao;

    @Override
    public List<ContractWithHistoryDto> myContractsForACurrency(Currency c) {

        User u = userSvc.getCurrentUser();

        List<Contract> ct = contractDao.findContract(c, u);

        return ct.stream().map(
                    (contract) ->  {
                        List<ContractProjection> h = contractHistoryDao.findOnlyNoteByContract(contract.getRef());
                        ContractWithHistoryDto contractWithHistoryDto = modelMapper.map(contract, ContractWithHistoryDto.class);
                        contractWithHistoryDto.setHistory(h);
                        return contractWithHistoryDto;
                    }
                ).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Contract create(Currency currency, String paymentAddress) {

        Coin coin = coinDao.findByCurrency(currency).orElseThrow(
                () -> new IllegalStateException(
                        String.format("Sorry, coin attached to %s not found", currency.toString())
                )
        );

        Fold fold = walletSvc.getRawFold(currency.toString());

        CryptoProviderAddress providerAddress = cryptoProviderAddressDao.findByAddress(paymentAddress).orElseThrow( () ->  new RuntimeException("Couldn't find payment expectation through "+paymentAddress)  );

        double hashPower = providerAddress.getExpectedAmount() * coin.getExchangeRateToHashPower();
        Contract contract = new Contract();
        User u = userSvc.getCurrentUser();
        contract.setUser(u);
        contract.setCoin(coin.getRef());
        contract.setHashPowerPurchased(hashPower);
        contract.setInterestAmountAccumulated(0);
        contract.setAmountInvested(providerAddress.getExpectedAmount());
        contract.setStatus(ContractStatus.ACTIVE);

        //Setup transaction
        Transaction tnx = new Transaction();
        tnx.setCurrency(currency);
        tnx.setAmount(providerAddress.getExpectedAmount());
        tnx.setFromType(FundSource.CRYPTO_PROVIDER);
        tnx.setFrom(paymentAddress);
        tnx.setToType(FundSource.WALLET);
        tnx.setTo(fold.getRef());
        tnx.setMode(TransactionMode.INTER_FUND);
        tnx.setNote("Contract setup");
        tnx.setStatus(TransactionStatus.CONFIRMED);
        tnx.setType(TransactionType.PURCHASE);
        tnx.setNonce(KeyGen.generateLong(tnx.getFrom()+tnx.getTo() + tnx.getAmount() + tnx.getType() + tnx.getCurrency() + tnx.getType() ) );
        //Append tnx
        tnx.setContract(contract);

        ContractHistory history = new ContractHistory();
        history.setContract(contract);
        history.setNote("Initialization:New contract created with opening amount of "+providerAddress.getExpectedAmount()+""+currency.toString()+" investment");

        //Set up mining
        MineHistory mh = new MineHistory();
        mh.setContract(contract);
        mh.setAmountMined(0.00);
        mineHistoryDao.save(mh);

        contractHistoryDao.save(history);
        contractDao.save(contract);

        transactionDao.save(tnx);

        return contract;
    }

    @Override
    public List<Contract> fetch() {
        return contractDao.findAll();
    }

    @Override
    public Contract release(String ref) {
        Contract c = contractDao.findByRef(ref).orElseThrow( () -> new IllegalStateException("No contract found for "+ref));

        if (!c.getStatus().equals(ContractStatus.SUSPENDED)){
            throw new UnsupportedOperationException("Only suspended contract can be released");
        }

        if( Math.abs(Duration.between(LocalDateTime.now(), c.getCreatedAt()).toDays()) > c.getLifeSpan()  ) {
            Coin coin = coinDao.findByRef(c.getCoin()).orElseThrow( () -> new IllegalStateException("Coin associated to this contract is not found"));

            ContractHistory history = new ContractHistory();
            history.setContract(c);
            history.setNote("Release: contract was released with closing amount of "+c.getInterestAmountAccumulated()+ ""+coin.getCurrency() +" on "+c.getAmountInvested()+""+coin.getCurrency()+" investment");
            contractHistoryDao.save(history);

            //Update balance
            Fold fold = walletSvc.getRawFold(coin.getCurrency().toString());
            fold.setBalance(fold.getBalance() + c.getAmountInvested() + c.getInterestAmountAccumulated());
            foldDao.save(fold);

            //reset contract
            c.setStatus(ContractStatus.RELEASED);
            c.setInterestAmountAccumulated(0.00);
            c.setAmountInvested(0.00);
            contractDao.save(c);

            return c;

        }else{
            throw new UnsupportedOperationException("Contract must be span for "+c.getLifeSpan()+" days");
        }
    }

    @Override
    public Contract renew(String ref) {

        Contract c = contractDao.findByRef(ref).orElseThrow( () -> new IllegalStateException("No contract found for "+ref));

        if (!c.getStatus().equals(ContractStatus.SUSPENDED)){
            throw new IllegalStateException("Only suspended contract can be renewed");
        }

        if( Math.abs(Duration.between(LocalDateTime.now(), c.getCreatedAt()).toDays()) > c.getLifeSpan()  ) {
            Coin coin = coinDao.findByRef(c.getCoin()).orElseThrow( () -> new IllegalStateException("Coin associated to this contract is not found"));

            ContractHistory history = new ContractHistory();
            history.setContract(c);
            history.setNote("Renewal: contract was renewed with closing amount of "+c.getInterestAmountAccumulated()+ ""+coin.getCurrency() +" on "+c.getAmountInvested()+""+coin.getCurrency()+" investment");
            contractHistoryDao.save(history);

            //Update balance
            Fold fold = walletSvc.getRawFold(coin.getCurrency().toString());
            fold.setBalance(fold.getBalance() +  c.getInterestAmountAccumulated());
            foldDao.save(fold);

            //reset contract
            c.setStatus(ContractStatus.ACTIVE);
            c.setInterestAmountAccumulated(0.00);
            contractDao.save(c);

            return c;

        }else{
            throw new UnsupportedOperationException("Contract must be span for "+c.getLifeSpan()+" days");
        }
    }

    public Transaction moveFundsToFold(Currency currency, String ref, double amount){
        Coin coin = coinDao.findByCurrency(currency).orElseThrow(
                () -> new IllegalStateException(
                        String.format("Sorry, coin attached to %s not found", currency.toString())
                )
        );
        Fold fold = walletSvc.getRawFold(coin.getCurrency().toString());

        Contract contract = contractDao.findByRef(ref).orElseThrow( () -> new IllegalStateException("Contract ref :"+ ref+": not found"));

        Transaction latest = transactionDao.findByContract(contract, TransactionType.CONTRACT_FUND_TRANSFER).stream().max( Comparator.comparing(AbstractEntity::getCreatedAt) ).orElse(null);
        //Check when last mined
        if (latest != null){
            if( Math.abs(Duration.between(LocalDateTime.now(), latest.getCreatedAt()).toDays() ) < 1 ){
                throw new UnsupportedOperationException("You have to wait for a day interval for contract fund withdrawal");
            }
        }

        if (contract.getInterestAmountAccumulated() < amount){
            throw new IllegalStateException("Insufficient amount, can't withdraw higher than mined coin");
        }

        if (amount == 0){
            throw new UnsupportedOperationException("Can't withdraw zero value");
        }

        contract.setInterestAmountAccumulated(contract.getInterestAmountAccumulated() - amount);
        //Setup transaction
        Transaction tnx = new Transaction();
        tnx.setCurrency(currency);
        tnx.setAmount(amount);
        tnx.setFromType(FundSource.CONTRACT);
        tnx.setFrom(ref);
        tnx.setToType(FundSource.WALLET);
        tnx.setTo(fold.getRef());
        tnx.setMode(TransactionMode.INTRA_FUND);
        tnx.setNote("Contract fund transfer");
        tnx.setStatus(TransactionStatus.CONFIRMED);
        tnx.setType(TransactionType.CONTRACT_FUND_TRANSFER);
        tnx.setNonce(KeyGen.generateLong(tnx.getFrom()+tnx.getTo() + tnx.getAmount() + tnx.getType() + tnx.getCurrency() + tnx.getType() ) );
        //Append tnx
        tnx.setContract(contract);

        ContractHistory history = new ContractHistory();
        history.setContract(contract);
        history.setNote("Fund transfer: "+amount+""+currency.toString()+" transferred to "+currency.toString()+" wallet");

        contractHistoryDao.save(history);
        contractDao.save(contract);
        transactionDao.save(tnx);

        //Update balance
        fold.setBalance(fold.getBalance() +  amount);
        foldDao.save(fold);

        return tnx;
    }
}
