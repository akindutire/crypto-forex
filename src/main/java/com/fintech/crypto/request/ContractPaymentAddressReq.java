package com.fintech.crypto.request;

import com.fintech.crypto.enums.Currency;
import lombok.Getter;
import lombok.Setter;

import javax.validation.ValidationException;

@Getter
@Setter
public class ContractPaymentAddressReq {

    //CryptoVal
    private double expectedAmount;

    private Currency currency;

    public double getExpectedAmount() {
        if (expectedAmount > 0){
            return expectedAmount;
        }else {
            throw new ValidationException("Expected "+currency+" must not be zero");
        }
    }
}
