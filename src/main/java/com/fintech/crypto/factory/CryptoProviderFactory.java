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
            return ethereum;
        }else if (currency.equals(Currency.DOGE)){
            return dogecoin;
        }else if (currency.equals(Currency.ZEC)){
            return zcash;
        }else if(currency.equals(Currency.DASH)){
            return dash;
        }else{
            throw new IllegalStateException("Currency not supported");
        }

    }
}
