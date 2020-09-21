package com.fintech.crypto.service.utility;

import com.fintech.crypto.contract.Email;
import com.fintech.crypto.contract.PasswordResetCt;
import com.fintech.crypto.dao.PasswordResetDao;
import com.fintech.crypto.dao.UserDao;
import com.fintech.crypto.entity.PasswordResetSession;
import com.fintech.crypto.entity.User;
import com.fintech.crypto.prop.AppProp;
import com.fintech.crypto.request.PasswordResetReq;
import com.fintech.crypto.response.PasswordResetVerificationTokenCreationRes;
import com.fintech.crypto.security.KeyGen;
import com.fintech.crypto.service.domain.IUserSvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetSvc implements PasswordResetCt {

    @Autowired
    UserDao userDao;

    @Autowired
    PasswordResetDao passwordResetSessionDao;

    @Autowired
    AppProp prop;

    @Autowired
    IUserSvc userSvc;

    @Autowired
    @Qualifier("mail_gun")
    Email mailer;

    @Transactional
    public PasswordResetVerificationTokenCreationRes acquirePasswordResetVerificationToken(String email){

        User user = userDao.findByEmail(email).orElseThrow(
                () -> {
                    throw new IllegalStateException(String.format("Email %s not found in data store", email));
                }
                );

        Optional<PasswordResetSession> existingToken = passwordResetSessionDao.findByEmail(user.getEmail());
        existingToken.ifPresent( (passwordResetToken) -> {
            passwordResetSessionDao.delete(passwordResetToken);
            passwordResetSessionDao.flush();
        });

        String resetToken = KeyGen.generateLong(System.currentTimeMillis()+""+user.getEmail());
        PasswordResetSession resetTokenEntity = new PasswordResetSession();
        resetTokenEntity.setEmail(user.getEmail());
        resetTokenEntity.setToken(resetToken);

        //Send mail
        String resetLink = String.format("%s/%s/%s", prop.APP_DOMAIN_ADDRESS.replaceAll("/$", ""), prop.VIEW_WEB_PASSWORD_RESET.replaceAll("/$", ""), resetToken);
        String resetButton = String.format("<a style=\"padding: 16px 32px; width: 250px; margin: 32px 16px; color: #ffffff; background: #15c; border-radius: 5px;\" href=\"%s\">Reset password</a>", resetLink);
        String resetPwdForMailBody = String.format("<p>Needs to reset your password? Just click the button below.</p><p>If you didn't make this request, please ignore. Link is valid for %s mins</p> <br><p>%s </p><br><br><p>If you are having difficulty with the button above, copy and paste the link below to your browser url bar and execute</p><p>%s</p>", Long.parseLong(prop.PASSWORD_VERIFICATION_THRESHOLD)/60, resetButton, resetLink);

        mailer.send("CryptoFx Password Reset",
                "Reset your password",
                "",
                resetPwdForMailBody,
                prop.FROM_MAIL_ADDRESS,
                user.getEmail()
        );

        passwordResetSessionDao.save(resetTokenEntity);

        PasswordResetVerificationTokenCreationRes res = new PasswordResetVerificationTokenCreationRes();
        res.setPhone(user.getEmail());
        res.setExtra(prop.APP_DOMAIN_ADDRESS);
        return res;
    }

    @Override
    public Boolean resetPassword(PasswordResetReq request) {

        if (!request.getPassword().equals(request.getConfirmPassword())){
            throw new UnsatisfiedLinkError("Password does not match");
        }

        Optional<PasswordResetSession> checkedToken = passwordResetSessionDao.findByToken(request.getResetToken());
        if(checkedToken.isPresent()){

            //Check if token is expired
            if( checkedToken.get().getCreatedAt().plusSeconds(Long.parseLong(prop.PASSWORD_VERIFICATION_THRESHOLD)).isBefore(LocalDateTime.now())  ) {
                passwordResetSessionDao.delete(checkedToken.get());
                passwordResetSessionDao.flush();
                throw new RuntimeException(String.format("Reset link %s has expired, exceeds %d min", request.getResetToken(), Long.parseLong(prop.PASSWORD_VERIFICATION_THRESHOLD) / 60));
            }
        }else{
            throw new IllegalStateException(String.format("Reset link %s not found in data store", request.getResetToken()));
        }
        //Get email attached
        String email = checkedToken.get().getEmail();
        User user = userDao.findByEmail(email).orElseThrow(
                () -> {
                    throw new UsernameNotFoundException(
                            String.format(
                                    "Reset link not found for %s",
                                    email
                            )
                    );
                }
                );

        //Change password
        user.setPassword(
                userSvc.encodePassword(request.getPassword())
        );
        user.setIsUsing2FA(false);
        user.setSecretFor2FA(null);
        user.setEnabled(true);
        userDao.save(user);

        //Delete token after verification
        checkedToken.ifPresent( tokenEntity -> { passwordResetSessionDao.delete(tokenEntity); passwordResetSessionDao.flush(); });

        return true;
    }
}
