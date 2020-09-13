package com.fintech.crypto.dto;

import com.fintech.crypto.entity.CoinRate;
import com.fintech.crypto.enums.Currency;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CoinDto {

    private String ref;

    private String name;

    private String description;

    private Currency currency;

    private boolean mineable;

    private String hashPowerUnit;

    private double exchangeRateToHashPower;

    private List<CoinRate> coinRates;

}
