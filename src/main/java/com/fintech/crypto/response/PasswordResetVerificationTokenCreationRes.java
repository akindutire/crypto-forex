package com.fintech.crypto.response;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Component
@Getter @Setter
public class PasswordResetVerificationTokenCreationRes {
    private String phone;
    private String extra;
}
