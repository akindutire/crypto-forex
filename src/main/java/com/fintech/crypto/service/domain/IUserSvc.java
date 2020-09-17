package com.fintech.crypto.service.domain;

import com.fintech.crypto.context.DataLounge;
import com.fintech.crypto.contract.UserCt;
import com.fintech.crypto.dao.CryptoProviderAddressDao;
import com.fintech.crypto.dao.UserDao;
import com.fintech.crypto.entity.CryptoProviderAddress;
import com.fintech.crypto.entity.User;
import com.fintech.crypto.entity.Wallet;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.request.UserRegistrationReq;
import com.fintech.crypto.security.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IUserSvc implements UserCt {

    @Autowired
    IWalletSvc walletSvc;

    @Autowired
    UserDao userDao;

    @Autowired
    CryptoProviderAddressDao providerAddressDao;

    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public User createUser(UserRegistrationReq req) {

        if (userDao.findByEmail(req.getEmail()).isPresent()){
            throw new DuplicateKeyException("Account already existed");
        }else{

            Wallet w = walletSvc.create();
            User u = new User();
            u.setName(req.getName());
            u.setEmail(req.getEmail());
            u.setEnabled(true);
            u.setRole(req.getRole());
            u.setWallet(w);
            w.setUser(u);

            String encodedPwd = this.encodePassword(req.getPassword());
            u.setPassword(encodedPwd);

            return userDao.save(u);
        }
    }

    @Override
    public void activateUserAccount(String email) {
        User user = userDao.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException(String.format("Sorry, we could not get a match for %s in our data store", email))
        );

        if(!user.getEnabled()) {
            user.setEnabled(true);
            userDao.save(user);
        }
    }

    @Override
    public List<CryptoProviderAddress> getUnfufilledExpectation(Currency currency) {
        User u = this.getCurrentUser();
        List<CryptoProviderAddress> c = providerAddressDao.findByStatus("UNFULFILLED");
        System.out.println(c.size());
        return c.stream().filter( (cpa) -> cpa.getCurrency().equals(currency) && cpa.getUser().equals(u)).collect(Collectors.toList());
    }

    public User getCurrentUser() {
        return userDao.findByEmail(DataLounge.currentUserRecognizedByUniqueKey).orElseThrow(
                () -> new UsernameNotFoundException(
                        String.format("Sorry, we could not get a match for %s in data store", DataLounge.currentUserRecognizedByUniqueKey)
                )
        );
    }

    public String getUserRole(String email) {
        return userDao.findByEmailQ(email);
    }

    public Optional<UserDetails> selectApplicationUserByUsername(String email) {

        User user = userDao.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException(
                        String.format("Sorry, we could not get a match for %s in data store", email)
                )
        );

        AppUser applicationUser = new AppUser(
                user.getRole().getGrantedAuthority(),
                user.getPassword(),
                user.getEmail(),
                true,
                user.getEnabled(),
                true,
                user.getEnabled()
        );
        return Optional.of(applicationUser);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return this
                .selectApplicationUserByUsername(email)
                .orElseThrow(
                        () -> new UsernameNotFoundException(String.format("User with email %s not found", email))
                );
    }

    public String encodePassword(String password) {
        return bCryptPasswordEncoder.encode(password);
    }

}
