package com.fintech.crypto.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.Valid;

@Controller
@RequestMapping("/")
public class Home {
    @GetMapping("home")
    public void index(){
        System.out.println("I got home");
    }

    @GetMapping("ipn/coinpayment")
    public void ipnCoinpaymentIPN(@Valid @RequestParam(value = "address") String address, @RequestParam(value = "email") String email){
        System.out.println("I got home");
        //set nonce for payment

        //activate contract
    }

}
