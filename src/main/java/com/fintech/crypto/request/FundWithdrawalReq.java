package com.fintech.crypto.request;

import com.fintech.crypto.enums.Currency;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class FundWithdrawalReq {

    private Currency currency;

    @Min( value = 0L)
    private double amount;

    @NotBlank
    private String address;
}
