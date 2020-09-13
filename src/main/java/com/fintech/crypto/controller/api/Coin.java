package com.fintech.crypto.controller.api;

import com.fintech.crypto.dto.CoinDto;
import com.fintech.crypto.entity.CoinRate;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.request.CoinRateReq;
import com.fintech.crypto.request.CoinReq;
import com.fintech.crypto.request.CoinUpdateReq;
import com.fintech.crypto.service.domain.ICoinSvc;
import com.fintech.crypto.service.domain.IWalletSvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/coin/")
public class Coin {

    @Autowired
    ICoinSvc coinSvc;

    @Autowired
    IWalletSvc walletSvc;
    
    @PostMapping("add")
    public ResponseEntity<Map<String, Object>> add(@Valid @RequestBody CoinReq request){

        Map<String, Object> res = new HashMap<>();

        CoinDto c = coinSvc.add(request);
        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", request.getName()+" has been added");
        res.put("data", c);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PutMapping("toggle-mining-status")
    public ResponseEntity<Map<String, Object>> toggleMineStatus(@RequestParam(value = "ref") String coinRef){

        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", " coin status altered");
        res.put("data", coinSvc.toggleMining(coinRef));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("append-rate")
    public ResponseEntity<Map<String, Object>> appendRate(@Valid @RequestBody CoinRateReq request){

        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", request.getLabel()+" rate has been added/updated");
        res.put("data", coinSvc.addRate(request));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PutMapping("update")
    public ResponseEntity<Map<String, Object>> update(@Valid @RequestBody CoinUpdateReq request){

        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", request.getName()+" updated");
        res.put("data", coinSvc.update(request));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("currencies")
    public ResponseEntity<Map<String, Object>> fetchRates(){

        Map<String, Object> res = new HashMap<>();
        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", "Currencies fetched");
        res.put("data", Currency.values());

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("fetch-rates")
    public ResponseEntity<Map<String, Object>> fetchRates(@RequestParam(value = "coin-ref") String coinRef){

        Map<String, Object> res = new HashMap<>();

        List<CoinRate> coinRates =  coinSvc.getRates(coinRef);
        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", coinRates.size() + " rate fetched");
        res.put("data", coinRates);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("fetch")
    public ResponseEntity<Map<String, Object>> fetch(@Valid @RequestParam(value = "mineable", defaultValue = "1") String mineable){

        Map<String, Object> res = new HashMap<>();

        boolean b = true;
        if (mineable.equals("0")){
            b = false;
        }

        List<CoinDto> coins =  coinSvc.fetchByMineable(b);
        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", coins.size() + " mineable coin fetched");
        res.put("data", coins);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("fetch-all")
    public ResponseEntity<Map<String, Object>> fetchAll(){

        Map<String, Object> res = new HashMap<>();

        List<CoinDto> coins =  coinSvc.fetch();
        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", coins.size() + " mineable coin fetched");
        res.put("data", coins);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("query")
    public ResponseEntity<Map<String, Object>> query(@Valid @RequestParam(value = "ref", defaultValue = "000") String ref){

        Map<String, Object> res = new HashMap<>();

        List<CoinDto> coins;
        if (ref.equals("000")){
            coins = coinSvc.query();
        }else{
            coins = coinSvc.query(ref);
        }

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", coins.size() + " coin fetched");
        res.put("data", coins);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("fetch-fold")
    public ResponseEntity<Map<String, Object>> fetchFold(@RequestParam( value = "currency") String coinCurrency) {

        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", coinCurrency+" wallet fold fetched");
        res.put("data", walletSvc.getFold(coinCurrency) );

        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
