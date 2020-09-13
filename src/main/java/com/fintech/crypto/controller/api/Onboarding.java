package com.fintech.crypto.controller.api;

import com.fintech.crypto.request.UserRegistrationReq;
import com.fintech.crypto.service.domain.IUserSvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/onboard/")
public class Onboarding {

    @Autowired
    IUserSvc userSvc;

    @PostMapping("signup")
    public ResponseEntity<Map<String, Object>> signUp(@Valid @RequestBody UserRegistrationReq request){
        // Save user basic details, send welcome mail

        Map<String, Object> res = new HashMap<>();

        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", request.getRole()+" Account created");
        res.put("data", userSvc.createUser(request));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

}
