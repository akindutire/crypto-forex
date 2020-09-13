package com.fintech.crypto.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class Home {
    @GetMapping("home")
    public void index(){
        System.out.println("I got home");
    }
}
