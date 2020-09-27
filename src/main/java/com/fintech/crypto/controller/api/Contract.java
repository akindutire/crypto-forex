package com.fintech.crypto.controller.api;

import com.fintech.crypto.contract.BlockCypherCryptoProviderCt;
import com.fintech.crypto.contract.BlockIoCryptoProviderCt;
import com.fintech.crypto.contract.CoinPaymentCt;
import com.fintech.crypto.contract.CryptoProvider;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.factory.CryptoProviderFactory;
import com.fintech.crypto.request.ContractCreactionReq;
import com.fintech.crypto.request.ContractPaymentAddressReq;
import com.fintech.crypto.request.FundMovementToDashboard;
import com.fintech.crypto.service.domain.IContractSvc;
import com.fintech.crypto.service.domain.IUserSvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/contract/")
public class Contract {

    @Autowired
    IContractSvc contractSvc;

    @Autowired
    IUserSvc userSvc;

    @Autowired
    CryptoProviderFactory cryptoProviderFactory;

    @PostMapping("generate/address/to/pay/hashpower")
    public ResponseEntity<Map<String, Object>> generateAddressForPurchase(@Valid @RequestBody ContractPaymentAddressReq request){
        Map<String, Object> res = new HashMap<>();

        if (!contractSvc.validateMinimumInvestment(request.getExpectedAmount(), request.getCurrency()) ){
            throw new UnsupportedOperationException("Minimum deposit reached");
        }

        Currency c = request.getCurrency();
        String address, meta;
        if(c.equals(Currency.BTC) || c.equals(Currency.LTC) || c.equals(Currency.DOGE)) {
            BlockIoCryptoProviderCt cryptoProvider = (BlockIoCryptoProviderCt) cryptoProviderFactory.getProvider(c);
            address = cryptoProvider.getRandomAddress(request.getExpectedAmount());
            meta = "";
        }else if (c.equals(Currency.ETH)){
            CoinPaymentCt cryptoProvider = (CoinPaymentCt) cryptoProviderFactory.getProvider(c);
            String[] bundle = cryptoProvider.getRandomAddress(request.getExpectedAmount()).split("/", 2);
            address = bundle[1];
            meta = bundle[0];
        }else{
            CryptoProvider cryptoProvider = cryptoProviderFactory.getProvider(c);
            address = "";
            meta = "";
        }

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", request.getExpectedAmount() + " hashpower is expected on " +address);
        res.put("data", address);
        res.put("address", address);
        res.put("meta", meta);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("probe/hashpowerpurchase")
    public ResponseEntity<Map<String, Object>> probePurchase(@Valid @RequestBody ContractCreactionReq request){
        try{
            Map<String, Object> res = new HashMap<>();

            Currency c = request.getCurrency();
            boolean paymentState;
            if(c.equals(Currency.BTC) || c.equals(Currency.LTC) || c.equals(Currency.DOGE)) {
                BlockIoCryptoProviderCt cryptoProvider = (BlockIoCryptoProviderCt) cryptoProviderFactory.getProvider(c);
                paymentState = cryptoProvider.probePayment(request.getPaymentAddress());
            }else if (c.equals(Currency.ETH)){
                CoinPaymentCt cryptoProvider = (CoinPaymentCt) cryptoProviderFactory.getProvider(c);
                paymentState = cryptoProvider.probePayment(request.getPaymentAddress());;
            }else{
                CryptoProvider cryptoProvider = cryptoProviderFactory.getProvider(c);
                paymentState = false;
            }

            if (request.getPaymentAddress().length() > 0){

                String msg;
                if (paymentState){
                    msg = "Payment approved, contract created, goto contract page";
                }else{
                    throw new Exception("Payment not approved, try again later");
                }
                res.put("status", HttpStatus.OK.value());
                res.put("code", HttpStatus.OK);
                res.put("message", msg);
                res.put("data", "");
                res.put("paymentStatus", paymentState);
                return new ResponseEntity<>(res, HttpStatus.OK);

            }else{
                throw new Exception("Address not found");
            }

        }catch (Exception e){
            throw new IllegalStateException(e.getMessage());
        }
    }

    @GetMapping("fetch")
    public ResponseEntity<Map<String, Object>> fetch(@Valid @RequestParam(value = "currency", defaultValue = "000") String currency){

        Map<String, Object> res = new HashMap<>();

        if (currency.equals("000")){
            res.put("data", contractSvc.fetch());
        }else {
            res.put("data", contractSvc.myContractsForACurrency(Currency.valueOf(currency)));
        }

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", "Contracts fetched");

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("fetch/unfufilled/payment/expectation")
    public ResponseEntity<Map<String, Object>> fetchUnfulfilledPaymentExpectation(@RequestParam( value = "currency") String currency){
        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", "Unfufilled expectations for "+currency);
        res.put("data", userSvc.getUnfufilledExpectation(Currency.valueOf(currency)));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("renew")
    public ResponseEntity<Map<String, Object>> renew(@Valid @RequestParam(value = "ref") String ref){

        Map<String, Object> res = new HashMap<>();

        List<com.fintech.crypto.entity.Contract> contracts;


        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", "Contracts renewed");
        res.put("data", contractSvc.renew(ref));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("release")
    public ResponseEntity<Map<String, Object>> release(@Valid @RequestParam(value = "ref") String ref){

        Map<String, Object> res = new HashMap<>();

        List<com.fintech.crypto.entity.Contract> contracts;

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", "Contracts renewed");
        res.put("data", contractSvc.release(ref));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("move/funds/to/fold")
    public ResponseEntity<Map<String, Object>> moveFunds(@Valid  @RequestBody FundMovementToDashboard fundMovementToDashboard){

        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", fundMovementToDashboard.getAmount()+""+fundMovementToDashboard.getCurrency()+" moved to wallet");
        res.put("data", contractSvc.moveFundsToFold(fundMovementToDashboard.getCurrency(), fundMovementToDashboard.getRef(), fundMovementToDashboard.getAmount()));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
