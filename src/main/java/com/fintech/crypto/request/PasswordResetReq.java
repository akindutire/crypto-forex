package com.fintech.crypto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Getter @Setter
public class PasswordResetReq {
    @NotBlank
    @Pattern(regexp = "^[0-9]{6}", message = "Password must be numbers of 6 digits long")
    private String password;

    @NotBlank
    private String verificationToken;

}
