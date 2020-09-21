package com.fintech.crypto.request;

import com.fintech.crypto.security.AppUserRole;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Getter @Setter
public class UserRegistrationReq {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String name;

    @NotBlank
    private String password;

    @NotBlank
    private String confirmPassword;

    private String referralUserKey;

    private AppUserRole role = AppUserRole.CLIENT;
}
