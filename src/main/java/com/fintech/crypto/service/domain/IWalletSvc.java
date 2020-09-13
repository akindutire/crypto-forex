package com.fintech.crypto.service.domain;

import com.fintech.crypto.dao.ContractDao;
import com.fintech.crypto.dao.TransactionDao;
import com.fintech.crypto.entity.Transaction;
import com.fintech.crypto.enums.*;
import org.modelmapper.ModelMapper;
import com.fintech.crypto.contract.WalletCt;
import com.fintech.crypto.dao.FoldDao;
import com.fintech.crypto.dao.WalletDao;
import com.fintech.crypto.dto.CoinDto;
import com.fintech.crypto.dto.FoldDto;
import com.fintech.crypto.entity.Fold;
import com.fintech.crypto.entity.User;
import com.fintech.crypto.entity.Wallet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fintech.crypto.security.KeyGen;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IWalletSvc implements WalletCt {

    @Autowired
    WalletDao walletDao;

    @Autowired
    FoldDao foldDao;

    @Autowired
    ContractDao contractDao;

    @Autowired
    TransactionDao transactionDao;

    @Autowired
    ICoinSvc coinSvc;

    @Autowired
    IUserSvc userSvc;

    @Autowired
    ITnxSvc tnxSvc;

    @Autowired
    ModelMapper modelMapper;

    @Override
    public Wallet create() {
        Wallet w = new Wallet();
        w.setTargetCurrency(Currency.USD);
        return w;
    }

    @Override
    public Wallet read() {
        User u = userSvc.getCurrentUser();
        return walletDao.findByUser(u);
    }

    @Override
    public Fold createFold(Currency currency, Wallet wallet) {

        Fold f = new Fold();
        f.setCurrency(currency);
        f.setRef(KeyGen.generate());
        f.setWallet(wallet.getKey());
        foldDao.save(f);
        return f;
    }

    @Override
    public FoldDto getFold(String coinCurrency) {

        Wallet w = this.read();
        List<Fold> folds = foldDao.findByWK(w.getKey());

        Fold f = folds.stream().filter( fold -> fold.getCurrency().toString().equals(coinCurrency)).findFirst().orElse( new Fold() );

        if (f.getRef() == null){
            f = this.createFold(Currency.valueOf(coinCurrency), w);
        }
        return modelMapper.map(f, FoldDto.class);
    }

    @Override
    public Transaction withdraw(Currency currency, double amount, String address) {

        if (amount == 0){
            throw new UnsupportedOperationException("Can't withdraw zero fund");
        }
        Fold f = this.getRawFold(currency.toString());

        if(f.getBalance() < amount){
            throw new UnsupportedOperationException("Insufficient balance");
        }
        double limit = this.getWithdrawalLimit(currency);

        if(limit > 0){
            if (amount < limit){
                throw new UnsupportedOperationException("Minimum withdrawal limit is "+limit+""+currency.toString());
            }
        }

        Wallet w = this.read();
        w.setWithdrawalAddress(address);
        walletDao.save(w);

        //Setup transaction
        Transaction tnx = new Transaction();
        tnx.setCurrency(currency);
        tnx.setAmount(amount);
        tnx.setFromType(FundSource.WALLET);
        tnx.setFrom(f.getRef());
        tnx.setToType(FundSource.CRYPTO_PROVIDER);
        tnx.setTo(address);
        tnx.setMode(TransactionMode.INTER_FUND);
        tnx.setNote("fund withdrawal");
        tnx.setStatus(TransactionStatus.PENDING);
        tnx.setType(TransactionType.WITHDRAWAL);
        tnx.setNonce(KeyGen.generateLong(tnx.getFrom()+tnx.getTo() + tnx.getAmount() + tnx.getType() + tnx.getCurrency() + tnx.getType() ) );
        //Append tnx
        tnx.setContract(null);
        transactionDao.save(tnx);

        return tnx;
    }

    public Fold getRawFold(String coinCurrency) {

        Wallet w = this.read();
        List<Fold> folds = foldDao.findByWK(w.getKey());

        Fold f = folds.stream().filter( fold -> fold.getCurrency().toString().equals(coinCurrency)).findFirst().orElse( new Fold() );

        if (f.getRef() == null){
            f = this.createFold(Currency.valueOf(coinCurrency), w);
        }
        return f;
    }

    public double getWithdrawalLimit(Currency currency){
        double limit;
        if (currency.equals(Currency.BTC)){
            limit = 0.001;
        }else if (currency.equals(Currency.ETH)){
            limit = 0.02;
        }else if (currency.equals(Currency.LTC)){
            limit = 0.2;
        }else if (currency.equals(Currency.DGD)){
            limit = 5000;
        }else{
            limit = -1;
        }
        return  limit;
    }

    public Transaction approveWithdrawalRequest(String ref){

        Transaction t = tnxSvc.query(ref);
        if (!t.getType().equals(TransactionType.WITHDRAWAL)){
            throw new UnsupportedOperationException("This request is not an authentic withdrawal request");
        }

        if (!t.getStatus().equals(TransactionStatus.PENDING)){
            throw  new UnsupportedOperationException("Only pending transaction/request can be shared-executed");
        }

        Fold f = foldDao.findByRef(t.getFrom());

        if(f.getBalance() < t.getAmount()){
            t.setStatus(TransactionStatus.REJECTED);
            transactionDao.save(t);
            throw new UnsupportedOperationException("Wallet has insufficient balance and withdrawal has been rejected");
        }

        f.setBalance(f.getBalance() - t.getAmount());
        foldDao.save(f);

        t.setStatus(TransactionStatus.CONFIRMED);
        transactionDao.save(t);
        return t;
    }
}
