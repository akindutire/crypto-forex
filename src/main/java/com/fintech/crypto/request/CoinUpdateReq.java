package com.fintech.crypto.request;

import com.fintech.crypto.enums.Currency;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Getter
@Setter
public class CoinUpdateReq {

    @NotBlank
    private String ref;

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    @NotBlank
    @Pattern(regexp = "[A-Za-z/]+")
    private String hashPowerUnit;

    @Min( value = 0L)
    private double exchangeRateToHashPower;

    private Currency currency;

}
