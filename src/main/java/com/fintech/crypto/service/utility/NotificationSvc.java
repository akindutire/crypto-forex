package com.fintech.crypto.service.utility;

import com.fintech.crypto.contract.Email;
import com.fintech.crypto.dao.FoldDao;
import com.fintech.crypto.dao.UserDao;
import com.fintech.crypto.dao.WalletDao;
import com.fintech.crypto.entity.*;
import com.fintech.crypto.enums.Currency;
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
        String loginLink = prop.APP_DOMAIN_ADDRESS+"/login";
        String aboutLink = prop.APP_DOMAIN_ADDRESS+"/about";
        String bountyLink = prop.APP_DOMAIN_ADDRESS+"/bounty-link";
        String telegramLink = "https://t.me/cryptoforex_2020";

        mailer.send(
                "Welcome "+user.getName(),
                "Welcome to Crypto <span style='color: red'>Forex</span>",
                String.format("Dear %s, <br>We warmly welcome you to the Crypto Forex family and thank you for your ongoing support<br>Your account registration is now complete - just grab your details below:<br /><br />Login: <a href='%s'>%s</a><br/>You can login here: %s<br><br/>Head over to our site now to be the first to try out our <a href='%s'>Bounty Program</a> and earn exclusive bonuses for helping to spread the word of Crypto Forex plus help us continue developing the platform.<br/><br/>Until then, happy trading and keep an eye on <a href='%s'>telegram channel</a> where we will soon be announcing the much-awaited start of our trading discount!<br/><br/><p style='text-align: center'><a href='%s'>Learn more</a></p>", user.getName(), user.getEmail(), loginLink, loginLink, bountyLink, telegramLink, aboutLink),
                "Start mining today",
                prop.FROM_MAIL_ADDRESS,
                user.getEmail()
        );
    }

    public void referralNotice(User user) {
        // Send welcome email
        String loginLink = prop.APP_DOMAIN_ADDRESS+"/login";
        String aboutLink = prop.APP_DOMAIN_ADDRESS+"/about";
        String bountyLink = prop.APP_DOMAIN_ADDRESS+"/bounty-link";
        String telegramLink = "https://t.me/cryptoforex_2020";

        mailer.send(
                "You have received a referral commission",
                "Congratulations! You Have a NEW Direct Referral Signup!",
                String.format("Dear %s, <br>We warmly welcome you to the Crypto Forex family and thank you for your ongoing support<br>Your account registration is now complete - just grab your details below:<br /><br />Login: <a href='%s'>%s</a><br/>You can login here: %s<br><br/>Head over to our site now to be the first to try out our <a href='%s'>Bounty Program</a> and earn exclusive bonuses for helping to spread the word of Crypto Forex plus help us continue developing the platform.<br/><br/>Until then, happy trading and keep an eye on <a href='%s'>telegram channel</a> where we will soon be announcing the much-awaited start of our trading discount!<br/><br/><p style='text-align: center'><a href='%s'>Learn more</a></p>", user.getName(), user.getEmail(), loginLink, loginLink, bountyLink, telegramLink, aboutLink),
                "Start mining today",
                prop.FROM_MAIL_ADDRESS,
                user.getEmail()
        );
    }

    public void newContractNotice(Contract contract, Currency c) {
        // Send welcome email
        String aboutLink = prop.APP_DOMAIN_ADDRESS+"/about";

        mailer.send(
                "Hash power order received",
                "Crypto FX", "Your Hashpower Order has been Received",
                String.format("Dear %s, <br>We have successfully received your purchase and contract %s! has been initialized, your mining start at 0.00 with an investment of %s%s.<br/>Thank you for choosing Crypto Forex as your gateway to trading and the world of cloud crypto mining!<br/><p style='text-align: center'><a href='%s'>Learn more</a></p>", contract.getUser().getName(),contract.getRef(), contract.getAmountInvested(), c.toString(), aboutLink),
                prop.FROM_MAIL_ADDRESS,
                contract.getUser().getEmail()
        );
    }

    public void withdrawalNotice(Transaction tnx, String name, String email) {
        // Send welcome email
        mailer.send(
                tnx.getAmount()+""+tnx.getCurrency()+" withdrawal completed!",
                "Crypto FX", "Your Withdrawal Was Successful",
                String.format("Dear %s, <br>The amount "+tnx.getAmount()+""+tnx.getCurrency()+" has been successfully sent to your Bitcoin address following a withdrawal request from your Crypto Forex account wallet.<br/>Tx ref: %s<br />In the unlikely case that you did not authorise this withdrawal, please let us know immediately.", name, tnx.getRef()),
                prop.FROM_MAIL_ADDRESS,
                email
        );
    }

    public void contractTerminationNotice(ContractHistory contractHistory, String email) {
        // Send welcome email
        mailer.send(
                "Contract termination",
                "Crypto FX", "Contract terminated",
                contractHistory.getNote(),
                prop.FROM_MAIL_ADDRESS,
                email
        );
    }

    public void contractRenewalNotice(ContractHistory contractHistory, String email, String name) {
        // Send welcome email
        mailer.send(
                "Contract renewal",
                "Crypto FX", "Contract renewed",
                "Hi "+name+",<br>"+contractHistory.getNote(),
                prop.FROM_MAIL_ADDRESS,
                email
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
                    "<b>"+tnx.getStatus()+"</b>: %s transaction has been executed from %s to a %s\nAmt:%f \nCurrency: %s\nDetails:%s",
                    tnx.getRef(),
                    name,
                    tnx.getToType()+"("+tnx.getTo()+")",
                    tnx.getAmount(),
                    tnx.getCurrency(),
                    tnx.getNote()
                    ),
                    prop.FROM_MAIL_ADDRESS, email);

            if(tnx.getToType().equals(FundSource.WALLET)) {

                mailer.send("Crypto Fx Transaction", String.format("[%s]Transaction Receipt", tnx.getType()), "", String.format(
                        "<b>" + tnx.getStatus() + "</b>: %s transaction has been executed from %s\nAmt:%f \nCurrency: %s\nDetails:%s",
                        tnx.getRef(),
                        name,
                        tnx.getAmount(),
                        tnx.getCurrency(),
                        tnx.getNote()
                        ),
                        prop.FROM_MAIL_ADDRESS, email);
            }

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
                    prop.FROM_MAIL_ADDRESS, email);

        }
    }

    public Boolean contactUsMessage(String email, String name, String subject, String body) {
        // Send welcome email
        mailer.send(
                subject,
                "Crypto FX - Support",
                subject,
                body+" - <b>"+ name+"</b>("+email+")",
                prop.FROM_MAIL_ADDRESS,
                prop.SUPPORT_MAIL_ADDRESS
        );

        return true;
    }
}
