package com.fintech.crypto.service.utility.crypto;

import com.fintech.crypto.contract.BlockCypherCryptoProviderCt;
import com.fintech.crypto.dao.CryptoProviderAddressDao;
import com.fintech.crypto.entity.CryptoProviderAddress;
import com.fintech.crypto.entity.User;
import com.fintech.crypto.enums.CryptoAddressPurpose;
import com.fintech.crypto.enums.CryptoAddressVendor;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.prop.AppProp;
import com.fintech.crypto.service.domain.IUserSvc;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Ethereum implements BlockCypherCryptoProviderCt {

    @Autowired
    AppProp prop;

    @Autowired
    IUserSvc userSvc;

    @Autowired
    CryptoProviderAddressDao cryptoProviderAddressDao;

    @Override
    public String getRandomAddress(double expectedAmount) {
        final String EndPoint = prop.BLOCKCYPHER_BASE_URL+ "eth/main/address?token="+prop.CRYPT_API_KEY_ETH;

        User user = userSvc.getCurrentUser();

        try {
            HttpResponse<JsonNode> jsonResponse  = Unirest.get(EndPoint).asJson();

            JsonNode responseBody = jsonResponse.getBody();
            assert responseBody != null;

            JSONObject res = responseBody.getObject();

            if (res.getString("status").equals("fail")){
                throw new RuntimeException("Error generating payment address.");
            }

            JSONObject resObject = res.getJSONObject("data");

            CryptoProviderAddress cryptoProviderAddress = new CryptoProviderAddress();
            cryptoProviderAddress.setUser(user);
            cryptoProviderAddress.setAddress(resObject.getString("address"));
            cryptoProviderAddress.setPurpose(CryptoAddressPurpose.PAYMENT_EXPECTATION);
            cryptoProviderAddress.setStatus("UNFULFILLED");
            cryptoProviderAddress.setExpectedAmount(expectedAmount);
            cryptoProviderAddress.setCurrency(Currency.ETH);
            cryptoProviderAddress.setVendor(CryptoAddressVendor.BLOCKIO);
            cryptoProviderAddressDao.save(cryptoProviderAddress);

            System.out.println("Address========="+cryptoProviderAddress.getAddress());
            return resObject.getString("address");

        } catch (NullPointerException | UnirestException e) {
            throw new RuntimeException("Connection not successful, wallet not created, please try again. " + e.getMessage());
        }
    }
}
