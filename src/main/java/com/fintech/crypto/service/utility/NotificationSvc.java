package com.fintech.crypto.service.utility;

import com.fintech.crypto.contract.Email;
import com.fintech.crypto.dao.FoldDao;
import com.fintech.crypto.dao.UserDao;
import com.fintech.crypto.dao.WalletDao;
import com.fintech.crypto.entity.*;
import com.fintech.crypto.enums.FundSource;
import com.fintech.crypto.prop.AppProp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class NotificationSvc {

    @Autowired
    @Qualifier("mail_gun")
    Email mailer;

    @Autowired
    AppProp prop;

    @Autowired
    WalletDao walletDao;

    @Autowired
    FoldDao foldDao;

    @Autowired
    UserDao userDAO;


    public void endOfOnBoardingNotice(User user) {
        // Send welcome email
        mailer.send(
                "Welcome to Crypto Forex",
                "Crypto FX",
                String.format("Hey %s! You joined Crypto Forex", user.getName()),
                "Start mining today",
                prop.FROM_MAIL_ADDRESS,
                user.getEmail()
        );

    }

    public void startOfOnBoardingNoticeOTPBasedOnSms(String token, String phone){
//        sms.send(String.format("Azapay OTP : %s ", token), prop.SYS_SMS_FROM_NUMBER, phone);
    }

    public void transactionCommitNotifications(Transaction tnx) {
        //Send mails/SMS to Sender
        String name;
        if(tnx.getFromType().equals(FundSource.WALLET)){
            Fold from = foldDao.findByRef(tnx.getFrom());
            Wallet f = walletDao.findByKey(from.getWallet());
            User ut = f.getUser();
            name = ut.getName();

            String email = ut.getEmail();

            System.out.println("=================fund source is wallet, tnx_Ref:"+tnx.getRef()+"/ email:" +email);

            mailer.send("Crypto Fx Transaction", String.format("[%s]Transaction Receipt", tnx.getType()),"", String.format(
                    "<b>"+tnx.getStatus()+"</b>: %s transaction has been executed from %s\nAmt:%f \nCurrency: %s\nDetails:%s",
                    tnx.getRef(),
                    name,
                    tnx.getAmount(),
                    tnx.getCurrency(),
                    tnx.getNote()
                    ),
                    "azapay@gmail.com", email);


        }else if(tnx.getFromType().equals(FundSource.CRYPTO_PROVIDER)){
            Fold to = foldDao.findByRef(tnx.getTo());
            Wallet f = walletDao.findByKey(to.getWallet());
            User ut = f.getUser();

            String email = ut.getEmail();

            System.out.println("=================fund source is crypto provider, tnx_Ref:"+tnx.getRef()+"/ email:" +email);

            mailer.send("Crypto Fx Transaction", String.format("[%s] Transaction Receipt", tnx.getType()),"", String.format(
                    "<b>"+tnx.getStatus()+"</b>: %s transaction has been completed\nAmt:%f \nCurrency: %s\nDetails:%s",
                    tnx.getRef(),
                    tnx.getAmount(),
                    tnx.getCurrency(),
                    tnx.getNote()
                    ),
                    "azapay@gmail.com", email);

        }
    }
}
