package com.fintech.crypto.service.utility;

import com.fintech.crypto.context.DataLounge;
import com.fintech.crypto.contract.*;
import com.fintech.crypto.dao.ContractDao;
import com.fintech.crypto.dao.TransactionDao;
import com.fintech.crypto.dao.UserDao;
import com.fintech.crypto.dto.UserDto;
import com.fintech.crypto.entity.*;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.enums.TransactionType;
import com.fintech.crypto.prop.AppProp;
import com.fintech.crypto.request.BasicProfileModificationReq;
import com.fintech.crypto.service.domain.IUserSvc;
import com.fintech.crypto.service.domain.IWalletSvc;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class ProfileSvc implements ProfileCt {

    @Autowired
    IUserSvc userSvc;

    @Autowired
    TotpSvc totpSvc;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    UserDao userDao;

    @Autowired
    ContractDao contractDao;

    @Autowired
    TransactionDao transactionDao;

    @Autowired
    IWalletSvc walletSvc;

    @Autowired
    AppProp prop;

    @Override
    public UserDto modifyNonBinaryOfProfile(BasicProfileModificationReq request) {
        User user = userDao.findByEmail(DataLounge.currentUserRecognizedByUniqueKey).orElseThrow(
                () -> new UsernameNotFoundException(String.format("Sorry, we could not get a match for %s in our data store", DataLounge.currentUserRecognizedByUniqueKey))
        );

        if (request.getName() != null){
            user.setName(request.getName());
        }

        if (request.getEmail() != null){
            user.setEmail(request.getEmail());
        }

        userDao.save(user);

        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(user, userDto);

        return userDto;
    }

    @Override
    public UserDto showFullProfile(String email) {

        User user = userDao.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException(String.format("Sorry, we could not get a match for %s in our data store", email))
        );

        List<Contract> contractList = user.getContract();
        UserDto res = modelMapper.map(user, UserDto.class);


        User u = userSvc.getCurrentUser();
        Map<String, Integer> m = new HashMap<>();
        Map<String, Double> coinMinedPerDay = new HashMap<>();
        Map<String, Double> coinMined = new HashMap<>();
        Map<String, Map<String, Double>> lastPurchasedAndWithdraw = new HashMap<>();

        Currency[] currencies = Currency.values();
        for (Currency c : currencies){
            List<Contract> ct = contractDao.findContract(c, u);
            int cs = ct.size();
            m.put(c.toString(), cs);

            double amountMined = 0;
            if (cs != 0){
                long days = Math.abs(Duration.between(LocalDateTime.now(), ct.get(0).getCreatedAt()).toDays());
                amountMined = ct.stream().mapToDouble(Contract::getInterestAmountAccumulated).sum() / days;
            }
            coinMinedPerDay.put(c.toString(), amountMined);

            coinMined.put(c.toString(), ct.stream().mapToDouble(Contract::getInterestAmountAccumulated).sum());

            double lpv = 0, lwv = 0;

            Fold f = walletSvc.getRawFold(c.toString());
            List<Transaction> pt = transactionDao.findByCurrency(c, f.getRef(), TransactionType.PURCHASE);
            int sp = pt.size();
            if (sp != 0){
                lpv = pt.get(sp-1).getAmount();
            }


            List<Transaction> wt = transactionDao.findByCurrency(c, f.getRef(), TransactionType.WITHDRAWAL);
            int sw = wt.size();
            if (sw != 0){
                lwv = wt.get(sw - 1).getAmount();
            }

            Map<String, Double> pwPair = new HashMap<>();
            pwPair.put("LP", lpv);
            pwPair.put("LW", lwv);

            lastPurchasedAndWithdraw.put(c.toString(), pwPair);
        }

        res.setCoinMined(coinMined);
        res.setCoinMinedPerDay(coinMinedPerDay);
        res.setContractCount(m);
        res.setLastPurchaseAndWithdrawal(lastPurchasedAndWithdraw);

        String address = user.getWallet().getWithdrawalAddress();
        if (address != null){
            address = address.trim();
        }else {
            address = "";
        }

        res.setWithdrawalAddress(address);

        return res;
    }

    @Override
    public UserDto showAnyProfile(String searchKey) {
        User user = userDao.findByEmail(searchKey).orElseThrow(
                () -> new UsernameNotFoundException(String.format("Sorry, we could not get a match for %s in our data store", searchKey))
        );
        UserDto res = new UserDto();
        BeanUtils.copyProperties(user, res);

        User u = userSvc.getCurrentUser();
        Map<String, Integer> m = new HashMap<>();
        Map<String, Double> coinMinedPerDay = new HashMap<>();
        Map<String, Double> coinMined = new HashMap<>();
        Map<String, Map<String, Double>> lastPurchasedAndWithdraw = new HashMap<>();

        Currency[] currencies = Currency.values();
        for (Currency c : currencies){
            List<Contract> ct = contractDao.findContract(c, u);
            int cs = ct.size();
            m.put(c.toString(), cs);

            double amountMined = 0;
            if (cs != 0){

                long days = Math.abs(Duration.between(LocalDateTime.now(), ct.get(0).getCreatedAt()).toDays());
                amountMined = ct.stream().mapToDouble(Contract::getInterestAmountAccumulated).sum() / Math.abs(days);
            }
            coinMinedPerDay.put(c.toString(), amountMined);

            coinMined.put(c.toString(), ct.stream().mapToDouble(Contract::getInterestAmountAccumulated).sum());

            double lpv = 0, lwv = 0;

            Fold f = walletSvc.getRawFold(c.toString());
            List<Transaction> pt = transactionDao.findByCurrency(c, f.getRef(), TransactionType.PURCHASE);
            int sp = pt.size();
            if (sp != 0){
                lpv = pt.get(sp-1).getAmount();
            }

            List<Transaction> wt = transactionDao.findByCurrency(c, f.getRef(), TransactionType.WITHDRAWAL);
            int sw = wt.size();
            if (sw != 0){
                lwv = wt.get(sw - 1).getAmount();
            }

            Map<String, Double> pwPair = new HashMap<>();
            pwPair.put("LP", lpv);
            pwPair.put("LW", lwv);

            lastPurchasedAndWithdraw.put(c.toString(), pwPair);
        }

        res.setCoinMined(coinMined);
        res.setCoinMinedPerDay(coinMinedPerDay);
        res.setContractCount(m);
        res.setLastPurchaseAndWithdrawal(lastPurchasedAndWithdraw);

        String address = user.getWallet().getWithdrawalAddress();
        if (address != null){
            address = address.trim();
        }else {
            address = "";
        }

        res.setWithdrawalAddress(address);

        return res;
    }

    @Override
    public String enable2FA() {
        User user = userSvc.getCurrentUser();

        user.setIsUsing2FA(true);
        user.setSecretFor2FA(totpSvc.generateSecret());
        userDao.save(user);
        return user.getSecretFor2FA();
    }

}



