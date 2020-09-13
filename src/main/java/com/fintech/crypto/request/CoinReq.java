package com.fintech.crypto.request;

import com.fintech.crypto.enums.Currency;
import lombok.Getter;
import lombok.Setter;
import org.checkerframework.common.value.qual.MinLen;

import javax.validation.ValidationException;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class CoinReq {

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    private Currency currency;

    @Min( value = 0L)
    private double exchangeRateToHashPower;

    @NotBlank
    private String hashPowerUnit;

    @Min( value = 0L)
    private double mineRate;

    public double getExchangeRateToHashPower() {
        if(exchangeRateToHashPower > 0){
            return exchangeRateToHashPower;
        }else{
            throw new ValidationException("Exchange rate of hash power must be greater than 0");
        }
    }
}
