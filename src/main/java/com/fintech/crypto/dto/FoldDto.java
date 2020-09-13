package com.fintech.crypto.dto;

import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.security.KeyGen;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class FoldDto {

    private Currency currency;

    private String ref;

    private double balance;

    private double ledgerBal;
}
