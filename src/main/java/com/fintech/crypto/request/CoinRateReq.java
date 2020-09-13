package com.fintech.crypto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.ValidationException;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class CoinRateReq {

    //Coin ref
    @NotBlank
    private String ref;

    @NotBlank
    private String label;



    @Min(value = 0L)
    private double minHashPower;

    @Min(value = 0L)
    private double maxHashPower;

    @Min(value = 0L)
    private double mineRate;

    public double getMineRate() {
        if (mineRate > 0){
            return mineRate;
        }else{
            throw new ValidationException("Mining rate must be greater than 0");
        }
    }
}
