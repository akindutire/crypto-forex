package com.fintech.crypto.service.utility.crypto;
import com.fintech.crypto.contract.BlockIoCryptoProviderCt;
import com.fintech.crypto.dao.CryptoProviderAddressDao;
import com.fintech.crypto.entity.CryptoProviderAddress;
import com.fintech.crypto.entity.User;
import com.fintech.crypto.enums.CryptoAddressPurpose;
import com.fintech.crypto.enums.CryptoAddressVendor;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.prop.AppProp;
import com.fintech.crypto.service.domain.IContractSvc;
import com.fintech.crypto.service.domain.IUserSvc;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class Bitcoin implements BlockIoCryptoProviderCt {

    @Autowired
    AppProp prop;

    @Autowired
    IUserSvc userSvc;

    @Autowired
    IContractSvc contractSvc;

    @Autowired
    CryptoProviderAddressDao cryptoProviderAddressDao;

    @Override
    public String getRandomAddress(double expectedAmount) {

        final String EndPoint = prop.BLOCKIO_BASE_URL + "get_new_address/?api_key="+prop.CRYPT_API_KEY_BTC;

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
            cryptoProviderAddress.setCurrency(Currency.BTC);
            cryptoProviderAddress.setVendor(CryptoAddressVendor.BLOCKIO);
            cryptoProviderAddressDao.save(cryptoProviderAddress);

            System.out.println("Address========="+cryptoProviderAddress.getAddress());
            return resObject.getString("address");

        } catch (NullPointerException | UnirestException e) {
            throw new RuntimeException("Connection not successful, wallet not created, please try again. " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> withdraw(double amount, List<String> address) {
        return null;
    }

    @Override
    public Boolean probePayment(String paymentAddress) {
        CryptoProviderAddress providerAddress = cryptoProviderAddressDao.findByAddress(paymentAddress).orElseThrow( () ->  new RuntimeException("Couldn't find payment expectation through "+paymentAddress)  );
        double balance = this.getBalance(paymentAddress);

        boolean res = balance >= providerAddress.getExpectedAmount();
        if (res){
            providerAddress.setStatus("FULFILLED");
            cryptoProviderAddressDao.save(providerAddress);
            //Create contract
            contractSvc.create(providerAddress.getCurrency(), providerAddress.getAddress());
            return true;
        }else{
            return false;
        }
    }

    @Override
    public Double getBalance(String address) {
        final String EndPoint = prop.BLOCKIO_BASE_URL + "get_address_balance/?api_key="+prop.CRYPT_API_KEY_BTC+"&addresses="+address;

        User user = userSvc.getCurrentUser();

        try {
            HttpResponse<JsonNode> jsonResponse  = Unirest.get(EndPoint).asJson();

            JsonNode responseBody = jsonResponse.getBody();
            assert responseBody != null;

            JSONObject res = responseBody.getObject();

            if (res.getString("status").equals("fail")){
                throw new RuntimeException("Error fetching balance");
            }

            String balanceFound = "0.00";
            JSONObject resObject = res.getJSONObject("data");
            JSONArray balances = resObject.getJSONArray("balances");
            for (int i=0; i < balances.length(); i++){

                JSONObject balance = balances.getJSONObject(i);
                if ( balance.getString("address").equals(address) ){
                    balanceFound = balance.getString("available_balance");
                    break;
                }
            }
            return Double.parseDouble(balanceFound);

        } catch (UnirestException e) {
            throw new RuntimeException("Connection not successful, wallet not created, please try again. " + e.getMessage());
        }
    }

    @Override
    public List<String> getAddresses() {
        return null;
    }

    @Override
    public Boolean archiveAddress(List<String> address) {
        return null;
    }

    @Override
    public Boolean unArchiveAddress(List<String> address) {
        return null;
    }
}
