package com.fintech.crypto.service.utility;

import com.fintech.crypto.context.DataLounge;
import com.fintech.crypto.contract.*;
import com.fintech.crypto.dao.ContractDao;
import com.fintech.crypto.dao.MineHistoryDao;
import com.fintech.crypto.dao.TransactionDao;
import com.fintech.crypto.dao.UserDao;
import com.fintech.crypto.dto.UserDto;
import com.fintech.crypto.entity.*;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.enums.TransactionType;
import com.fintech.crypto.prop.AppProp;
import com.fintech.crypto.request.BasicProfileModificationReq;
import com.fintech.crypto.request.MFASetup;
import com.fintech.crypto.security.KeyGen;
import com.fintech.crypto.service.domain.IUserSvc;
import com.fintech.crypto.service.domain.IWalletSvc;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    MineHistoryDao mineHistoryDao;

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
        if(user.getReferralKey() == null || user.getReferralKey().length() == 0 ){
            user.setReferralKey(KeyGen.generateLong(user.getName()+"&"+user.getEmail()));
            if(user.getIsUsing2FA() == null){ user.setIsUsing2FA(false); }
            userDao.save(user);
        }

        UserDto res = modelMapper.map(user, UserDto.class);

        Map<String, Integer> m = new HashMap<>();
        Map<String, Double> coinMinedPerDay = new HashMap<>();
        Map<String, Double> coinMined = new HashMap<>();
        Map<String, Map<String, Double>> lastPurchasedAndWithdraw = new HashMap<>();

        Currency[] currencies = Currency.values();
        for (Currency c : currencies){
            List<Contract> ct = contractDao.findContract(c, user);

            int cs = ct.size();
            m.put(c.toString(), cs);

            double amountMined = 0;
            if (cs != 0){
                long days = Math.abs(Duration.between(LocalDateTime.now(), ct.get(0).getCreatedAt()).toDays());
                if (days > 0) {
                    amountMined = ct.stream().mapToDouble(
                            (cti) -> {
                                List<MineHistory> mh = mineHistoryDao.findByContract(cti);
                                return mh.stream().mapToDouble(MineHistory::getAmountMined).sum();
                            }
                    ).sum() / days;
                }
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
            if(user.getSecretFor2FA() != null && user.getSecretFor2FA().length() > 0){
                String uri = totpSvc.getUriForImage(user.getSecretFor2FA());
                res.setSecretFor2FAUri(uri);
            }

            String address = user.getWallet().getWithdrawalAddress();
            if (address != null){
                address = address.trim();
            }else {
                address = "";
            }

            res.setWithdrawalAddress(address);
        }

        res.setCoinMined(coinMined);
        res.setCoinMinedPerDay(coinMinedPerDay);
        res.setContractCount(m);
        res.setLastPurchaseAndWithdrawal(lastPurchasedAndWithdraw);

        if(user.getSecretFor2FA() != null && user.getSecretFor2FA().length() > 0){
            String uri = totpSvc.getUriForImage(user.getSecretFor2FA());
            res.setSecretFor2FAUri(uri);
        }

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
        if(user.getReferralKey() == null || user.getReferralKey().length() < 8){
            user.setReferralKey(KeyGen.generateLong(user.getName()+"&"+user.getEmail()));
            if(user.getIsUsing2FA() == null){ user.setIsUsing2FA(false); }
            userDao.save(user);
        }

        UserDto res = modelMapper.map(user, UserDto.class);

        Map<String, Integer> m = new HashMap<>();
        Map<String, Double> coinMinedPerDay = new HashMap<>();
        Map<String, Double> coinMined = new HashMap<>();
        Map<String, Map<String, Double>> lastPurchasedAndWithdraw = new HashMap<>();

        Currency[] currencies = Currency.values();
        for (Currency c : currencies){
            List<Contract> ct = contractDao.findContract(c, user);
            int cs = ct.size();
            m.put(c.toString(), cs);

            double amountMined = 0;
            if (cs != 0){

                long days = Math.abs(Duration.between(LocalDateTime.now(), ct.get(0).getCreatedAt()).toDays());
                if (days > 0) {
                    amountMined = ct.stream().mapToDouble(
                            (cti) -> {
                                List<MineHistory> mh = mineHistoryDao.findByContract(cti);
                                return mh.stream().mapToDouble(MineHistory::getAmountMined).sum();
                            }
                    ).sum() / Math.abs(days);
                }
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

        if (user.getSecretFor2FA() != null && user.getSecretFor2FA().length() > 0) {
            String uri = totpSvc.getUriForImage(user.getSecretFor2FA());
            res.setSecretFor2FAUri(uri);
        }

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
    public MFASetup enable2FA() {
        User user = userSvc.getCurrentUser();

        user.setIsUsing2FA(true);
        user.setSecretFor2FA(totpSvc.generateSecret());
        userDao.save(user);

        String uri = totpSvc.getUriForImage(user.getSecretFor2FA());

        MFASetup ms = new MFASetup();
        ms.setSecret(user.getSecretFor2FA());
        ms.setUri(uri);

        return ms;
    }

    @Override
    public Boolean disable2FA() {
        User user = userSvc.getCurrentUser();

        user.setIsUsing2FA(false);
        user.setSecretFor2FA(null);
        userDao.save(user);
        return true;
    }

}



