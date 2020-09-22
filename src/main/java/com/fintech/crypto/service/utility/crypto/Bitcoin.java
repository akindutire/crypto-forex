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
public class Bitcoin implements BlockIoCryptoProviderCt {

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

        if(balance > 0){
            Fold f = walletSvc.getRawFold(Currency.BTC.toString());
            if (balance >= providerAddress.getExpectedAmount()){

                double excess = balance - providerAddress.getExpectedAmount();
                if(excess > 0){
                    f.setBalance( f.getBalance() + excess);
                    foldDao.save(f);
                }

                providerAddress.setExpectedAmount(providerAddress.getExpectedAmount() + f.getLedgerBal());
                providerAddress.setStatus("FULFILLED");
                cryptoProviderAddressDao.save(providerAddress);
                //Create contract
                contractSvc.create(providerAddress.getCurrency(), providerAddress.getAddress());
            }else{
                providerAddress.setStatus("PARTIALLY_FULFILLED");
                providerAddress.setExpectedAmount(providerAddress.getExpectedAmount() - balance);
                cryptoProviderAddressDao.save(providerAddress);

                Transaction tnx2 = new Transaction();
                tnx2.setCurrency(Currency.BTC);
                tnx2.setAmount(balance);
                tnx2.setFromType(FundSource.CRYPTO_PROVIDER);
                tnx2.setFrom(providerAddress.getAddress());
                tnx2.setToType(FundSource.WALLET);
                tnx2.setTo(f.getRef());
                tnx2.setMode(TransactionMode.INTER_FUND);
                tnx2.setNote("Contract payment converted to wallet topup ");
                tnx2.setStatus(TransactionStatus.CONFIRMED);
                tnx2.setType(TransactionType.WALLET_TOPUP);
                tnx2.setNonce(KeyGen.generateLong(tnx2.getFrom()+tnx2.getTo() + tnx2.getAmount() + tnx2.getType() + tnx2.getCurrency() + tnx2.getType() ) );
                transactionDao.save(tnx2);

                f.setLedgerBal( f.getLedgerBal() + balance);
                foldDao.save(f);

                notificationSvc.transactionCommitNotifications(tnx2);
            }
            return true;
        }else{
            return false;
        }

    }

    @Override
    public Double getBalance(String address) {
        final String EndPoint = prop.BLOCKIO_BASE_URL + "get_address_balance/?api_key="+prop.CRYPT_API_KEY_BTC+"&addresses="+address;

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
            if(balances.length() > 0){
                JSONObject balance = balances.getJSONObject(balances.length() - 1);
                balanceFound = balance.getString("available_balance");
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
