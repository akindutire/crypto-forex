package com.fintech.crypto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class LoginReq {

    @NotBlank
    @Email( message = "{Invalid email entered }")
    private String email;

    @NotBlank
    private String password;

}
