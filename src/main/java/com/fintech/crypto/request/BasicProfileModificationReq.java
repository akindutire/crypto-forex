package com.fintech.crypto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Getter @Setter
public class BasicProfileModificationReq {

    @NotBlank
    private String email;

    @NotBlank
    private String name;

}
