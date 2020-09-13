package com.fintech.crypto.factory;

import com.fintech.crypto.contract.CryptoProvider;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.service.utility.crypto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CryptoProviderFactory {

    @Autowired
    private Bitcoin bitcoin;

    @Autowired
    private Litecoin litecoin;

    @Autowired
    private Dogecoin dogecoin;

    @Autowired
    private Ethereum ethereum;

    @Autowired
    private Zcash zcash;

    @Autowired
    private Dash dash;

    public CryptoProvider getProvider(Currency currency){

        if (currency.equals(Currency.BTC)){
            return bitcoin;
        }else if (currency.equals(Currency.LTC)){
            return litecoin;
        }else if(currency.equals(Currency.ETH)){
            throw new IllegalStateException("Address not available");
        }else if (currency.equals(Currency.DGD)){
            return dogecoin;
        }else if (currency.equals(Currency.ZCH)){
            throw new IllegalStateException("Address not available");
        }else if(currency.equals(Currency.DSH)){
            throw new IllegalStateException("Address not available");
        }else{
            throw new IllegalStateException("Currency not supported");
        }

    }
}
