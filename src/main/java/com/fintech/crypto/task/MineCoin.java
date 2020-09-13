package com.fintech.crypto.task;

import com.fintech.crypto.contract.MiningCt;
import com.fintech.crypto.dao.CoinDao;
import com.fintech.crypto.dao.CoinRateDao;
import com.fintech.crypto.dao.ContractDao;
import com.fintech.crypto.dao.MineHistoryDao;
import com.fintech.crypto.entity.*;
import com.fintech.crypto.enums.ContractStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.TemporalUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;

@Component
public class MineCoin implements MiningCt {

    @Autowired
    ContractDao contractDao;

    @Autowired
    CoinDao coinDao;

    @Autowired
    MineHistoryDao mineHistoryDao;

    @Override
    public void mine() {

        System.out.println("=================Started Coin mining====================");

        List<Contract> savedUpdate = new ArrayList<>();
        try{
            List<Contract> contractList = contractDao.findAll();
            for (Contract c : contractList) {
                if (!c.getStatus().equals(ContractStatus.ACTIVE)){
                    continue;
                }

                MineHistory latest = mineHistoryDao.findByContract(c).stream().max( Comparator.comparing(AbstractEntity::getCreatedAt) ).orElse(null);
                //Check when last mined
               if (latest != null){
                   System.out.println(latest.getCreatedAt() +" logged");
                   if( Math.abs(Period.between( LocalDate.now(), latest.getCreatedAt().toLocalDate() ).getDays()) < 1 ){
                      continue;
                   }
               }

                //Get rate through hashpower
                Coin co = coinDao.findByRef(c.getCoin()).orElse(null);
                if(co == null){
                    break;
                }

                List<CoinRate> cr = co.getCoinRates();
                CoinRate rate = cr.stream().filter( (r) ->  r.getMinHashPower() <= c.getHashPowerPurchased() && (c.getHashPowerPurchased() <= r.getMaxHashPower() || r.getMaxHashPower() == 0)  ).findFirst().orElse(null);

                assert rate != null;
                double amountMined = (rate.getMineRate() / 100) * c.getAmountInvested();
                DecimalFormat decimalFormat = new DecimalFormat("#.########");
                decimalFormat.setRoundingMode(RoundingMode.HALF_DOWN);
                c.setInterestAmountAccumulated( c.getInterestAmountAccumulated() + amountMined);
                c.setInterestAmountAccumulated( Double.parseDouble(decimalFormat.format(c.getInterestAmountAccumulated()))  );

                //Add to mine history
                MineHistory mineHistory = new MineHistory();
                mineHistory.setAmountMined(amountMined);
                mineHistory.setContract(c);
                mineHistoryDao.save(mineHistory);

                if( Period.between( LocalDate.now(), c.getCreatedAt().toLocalDate() ).getDays() > c.getLifeSpan() ){
                    c.setStatus(ContractStatus.SUSPENDED);
                }
                savedUpdate.add(c);
            }

            contractDao.saveAll(savedUpdate);

        }catch (Exception e){
            System.out.println("=====================Coin mining missed==================="+e.getMessage());
        }
        System.out.println("=====================Ended Coin mining===================");
    }
}
