package com.fintech.crypto.request;

import com.fintech.crypto.enums.Currency;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class FundMovementToDashboard {

    private double amount;

    private Currency currency;

    @NotBlank
    private String ref;
}
