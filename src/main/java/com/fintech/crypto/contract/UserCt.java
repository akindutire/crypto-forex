package com.fintech.crypto.contract;

import com.fintech.crypto.entity.CryptoProviderAddress;
import com.fintech.crypto.entity.User;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.request.UserRegistrationReq;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserCt extends UserDetailsService {

    User createUser(UserRegistrationReq request);
    void activateUserAccount(String email);
    List<CryptoProviderAddress> getUnfufilledExpectation(Currency currency);
}
