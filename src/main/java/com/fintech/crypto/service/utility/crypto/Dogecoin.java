package com.fintech.crypto.service.utility.crypto;

import com.fintech.crypto.contract.BlockIoCryptoProviderCt;
import com.fintech.crypto.dao.CryptoProviderAddressDao;
import com.fintech.crypto.dao.FoldDao;
import com.fintech.crypto.dao.TransactionDao;
import com.fintech.crypto.entity.CryptoProviderAddress;
import com.fintech.crypto.entity.Fold;
import com.fintech.crypto.entity.Transaction;
import com.fintech.crypto.entity.User;
import com.fintech.crypto.enums.*;
import com.fintech.crypto.prop.AppProp;
import com.fintech.crypto.security.KeyGen;
import com.fintech.crypto.service.domain.IContractSvc;
import com.fintech.crypto.service.domain.IUserSvc;
import com.fintech.crypto.service.domain.IWalletSvc;
import com.fintech.crypto.service.utility.NotificationSvc;
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
public class Dogecoin implements BlockIoCryptoProviderCt {

    @Autowired
    AppProp prop;

    @Autowired
    NotificationSvc notificationSvc;

    @Autowired
    IUserSvc userSvc;

    @Autowired
    IContractSvc contractSvc;

    @Autowired
    IWalletSvc walletSvc;

    @Autowired
    CryptoProviderAddressDao cryptoProviderAddressDao;

    @Autowired
    FoldDao foldDao;

    @Autowired
    TransactionDao transactionDao;

    @Override
    public String getRandomAddress(double expectedAmount) {

        final String EndPoint = prop.BLOCKIO_BASE_URL + "get_new_address/?api_key="+prop.CRYPT_API_KEY_DGD;

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
            cryptoProviderAddress.setCurrency(Currency.DOGE);
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
        if(balance > 0){

            if (balance >= providerAddress.getExpectedAmount()){

                double ra = providerAddress.getReservedAmount();
                providerAddress.setExpectedAmount(balance + ra);
                providerAddress.setReservedAmount(0.00);
                providerAddress.setStatus("FULFILLED");
                cryptoProviderAddressDao.save(providerAddress);

                //Create contract
                contractSvc.create(providerAddress.getCurrency(), providerAddress.getAddress());
            }else{
                providerAddress.setStatus("PARTIALLY_FULFILLED");
                providerAddress.setExpectedAmount(providerAddress.getExpectedAmount() - balance);
                providerAddress.setReservedAmount(providerAddress.getReservedAmount() + balance);
                cryptoProviderAddressDao.save(providerAddress);
            }
            return true;
        }else{
            return false;
        }
    }

    @Override
    public Double getBalance(String address) {
        final String EndPoint = prop.BLOCKIO_BASE_URL + "get_address_balance/?api_key="+prop.CRYPT_API_KEY_DGD+"&addresses="+address;

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

            String nonce = balances.length()+""+resObject.getString("network")+address;
            CryptoProviderAddress c = cryptoProviderAddressDao.findByNonce(nonce).orElse(new CryptoProviderAddress());

            if(balances.length() > 0 && c.getNonce() == null){
                JSONObject balance = balances.getJSONObject(balances.length() - 1);
                balanceFound = balance.getString("available_balance");
                if(Double.parseDouble(balanceFound) > 0){
                    c = cryptoProviderAddressDao.findByAddress(address).get();
                    c.setNonce(nonce);
                    c.setModifiedAt();
                    cryptoProviderAddressDao.save(c);
                }
            }

//            totalBalanceFound = resObject.getString("available_balance");
//            for (int i=0; i < balances.length(); i++){
//
//                JSONObject balance = balances.getJSONObject(i);
//                if ( balance.getString("address").equals(address) ){
//                    balanceFound = balance.getString("available_balance");
//                    break;
//                }
//            }

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
