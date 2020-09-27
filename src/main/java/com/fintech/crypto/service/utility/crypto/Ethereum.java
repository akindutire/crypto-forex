package com.fintech.crypto.service.utility.crypto;

import com.fintech.crypto.contract.BlockCypherCryptoProviderCt;
import com.fintech.crypto.contract.CoinPaymentCt;
import com.fintech.crypto.dao.CryptoProviderAddressDao;
import com.fintech.crypto.entity.CryptoProviderAddress;
import com.fintech.crypto.entity.User;
import com.fintech.crypto.enums.CryptoAddressPurpose;
import com.fintech.crypto.enums.CryptoAddressVendor;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.prop.AppProp;
import com.fintech.crypto.security.KeyGen;
import com.fintech.crypto.service.domain.IContractSvc;
import com.fintech.crypto.service.domain.IUserSvc;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mashape.unirest.request.body.RequestBodyEntity;
import org.apache.http.client.ClientProtocolException;
import org.brunocvcunha.coinpayments.CoinPayments;
import org.brunocvcunha.coinpayments.model.AddressResponse;
import org.brunocvcunha.coinpayments.model.CreateTransactionResponse;
import org.brunocvcunha.coinpayments.model.ResponseWrapper;
import org.brunocvcunha.coinpayments.model.TransactionDetailsResponse;
import org.brunocvcunha.coinpayments.requests.CoinPaymentsCreateTransactionRequest;
import org.brunocvcunha.coinpayments.requests.CoinPaymentsDepositRequest;
import org.brunocvcunha.coinpayments.requests.CoinPaymentsGetTransactionInfoRequest;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Iterator;

@Service
public class Ethereum implements CoinPaymentCt {

    @Autowired
    AppProp prop;

    @Autowired
    IUserSvc userSvc;

    @Autowired
    CoinPayments coinPayments;

    @Autowired
    IContractSvc contractSvc;

    @Autowired
    CryptoProviderAddressDao cryptoProviderAddressDao;

    @Override
    public String getRandomAddress(double expectedAmount) {

        try {

            ResponseWrapper<AddressResponse> addressResponse = coinPayments.sendRequest(new CoinPaymentsDepositRequest(Currency.ETH.toString()));

            if (addressResponse.getError().equals("ok")) {
                User user = userSvc.getCurrentUser();
                ResponseWrapper<CreateTransactionResponse> txResponse = coinPayments.sendRequest(CoinPaymentsCreateTransactionRequest.builder()
                        .amount(expectedAmount)
                        .currencyPrice(Currency.ETH.toString())
                        .currencyTransfer(Currency.ETH.toString())
                        .callbackUrl(prop.APP_DOMAIN_ADDRESS+"/ipn/coinpayment?address=001"+"email"+user.getEmail())
                        .custom("ETH Hashpower purchase")
                        .buyerEmail(user.getEmail())
                        .buyerName(user.getName())
                        .itemName("ETH Hashpower purchase")
                        .build());
                if (txResponse.getError().equals("ok")) {
                    CryptoProviderAddress cryptoProviderAddress = new CryptoProviderAddress();
                    cryptoProviderAddress.setUser(user);
                    cryptoProviderAddress.setAddress(txResponse.getResult().getTransactionId());
                    cryptoProviderAddress.setPurpose(CryptoAddressPurpose.PAYMENT_EXPECTATION);
                    cryptoProviderAddress.setStatus("UNFULFILLED");
                    cryptoProviderAddress.setExpectedAmount(expectedAmount);
                    cryptoProviderAddress.setCurrency(Currency.ETH);
                    cryptoProviderAddress.setVendor(CryptoAddressVendor.COINPAYMENT);
                    cryptoProviderAddress.setMeta(txResponse.getResult().getAddress());
                    cryptoProviderAddressDao.save(cryptoProviderAddress);

                    System.out.println("Address=========" + addressResponse.getResult().getAddress()+"======Tnx id====="+cryptoProviderAddress.getAddress());
                    return txResponse.getResult().getAddress() + "/" + txResponse.getResult().getTransactionId();
                } else {
                    throw new IllegalStateException("Unable to setup payment environment, please retry");
                }
            } else {
                throw new IllegalStateException("Unable to fetch payment address, No payment setup");
            }
        } catch (NullPointerException | IOException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
    @Override
    public Boolean probePayment(String paymentTnxId) {
        CryptoProviderAddress providerAddress = cryptoProviderAddressDao.findByAddress(paymentTnxId).orElseThrow( () ->  new RuntimeException("Couldn't find payment expectation through "+paymentTnxId)  );
        double balance = this.getBalance(paymentTnxId);

        if(balance > 0){

            if (balance >= providerAddress.getExpectedAmount()){

                double ra = providerAddress.getReservedAmount();
                providerAddress.setExpectedAmount(balance + ra);
                providerAddress.setReservedAmount(0.00);
                providerAddress.setStatus("FULFILLED");
                providerAddress.setNonce(KeyGen.generateLong(providerAddress.getAddress()+providerAddress.getStatus()));
                cryptoProviderAddressDao.save(providerAddress);

                //Create contract
                contractSvc.create(providerAddress.getCurrency(), providerAddress.getAddress());
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    @Override
    public Double getBalance(String paymentTnxId) {

        try {
            double balanceFound = 0.00;
            ResponseWrapper<TransactionDetailsResponse> tnxResponse = coinPayments.sendRequest(new CoinPaymentsGetTransactionInfoRequest(paymentTnxId));
            if (tnxResponse.getError().equals("ok")) {
                System.out.println(tnxResponse.getResult().toString());
                balanceFound = tnxResponse.getResult().getReceivedf();
            }else{
                throw new IllegalStateException("Unable to retrieve balance, please try again");
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

            return balanceFound;

        } catch (IOException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}
