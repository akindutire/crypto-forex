package com.fintech.crypto.controller.api;

import com.fintech.crypto.context.DataLounge;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.request.BasicProfileModificationReq;
import com.fintech.crypto.request.FundWithdrawalApproveReq;
import com.fintech.crypto.request.FundWithdrawalReq;
import com.fintech.crypto.service.domain.ITnxSvc;
import com.fintech.crypto.service.domain.IUserSvc;
import com.fintech.crypto.service.domain.IWalletSvc;
import com.fintech.crypto.service.utility.ProfileSvc;
import org.apache.http.entity.ContentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user/")
public class User {

    @Autowired
    IUserSvc userSvc;

    @Autowired
    ProfileSvc profileSvc;

    @Autowired
    IWalletSvc walletSvc;

    @Autowired
    ITnxSvc iTnxSvc;

    @GetMapping( "profile" )
    public ResponseEntity<Map<String, Object>> displayFullProfile(@RequestParam( value = "search", defaultValue = "NULL") String searchKey){

        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        if (!searchKey.equals("NULL")){
            //random profile request
            res.put("data", profileSvc.showAnyProfile(searchKey));
        }else {
            //original profile request
            res.put("data", profileSvc.showFullProfile(DataLounge.currentUserRecognizedByUniqueKey));
        }

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PutMapping("profile/modify/basic")
    public ResponseEntity<Map<String, Object>> modifyProfileBasic(@Valid @RequestBody BasicProfileModificationReq request){
        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", "Basic profile details has been updated");
        res.put("data", profileSvc.modifyNonBinaryOfProfile(request));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("withdraw/fund")
    public ResponseEntity<Map<String, Object>> withdrawFund(@Valid @RequestBody FundWithdrawalReq request){
        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", "Fund withdrawal logged");
        res.put("data", walletSvc.withdraw(request.getCurrency(), request.getAmount(), request.getAddress()));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("transactions")
    public ResponseEntity<Map<String, Object>> transactions(@Valid @RequestParam( value = "currency") String currency){
        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", "All transactions");
        res.put("data", iTnxSvc.getTnx(Currency.valueOf(currency), ""));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("all/withdrawals")
    public ResponseEntity<Map<String, Object>> allWithdrawals(@Valid @RequestParam( value = "currency") String currency){
        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", "All transactions");
        res.put("data", iTnxSvc.getAllWithdrawalTnx(Currency.valueOf(currency)));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PutMapping("withdraw/approval")
    public ResponseEntity<Map<String, Object>> withdrawFundApproval(@Valid @RequestBody FundWithdrawalApproveReq request){
        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", "Fund withdraw approve");
        res.put("data", walletSvc.approveWithdrawalRequest(request.getTnxRef()));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //under review
    @GetMapping("approve/all/withdrawal")
    public ResponseEntity<Map<String, Object>> approveWithdrawals(@Valid @RequestParam( value = "currency") String currency){
        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", "Fund withdrawal");
//        res.put("data", walletSvc.approveWithdrawalRequests(currency));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
