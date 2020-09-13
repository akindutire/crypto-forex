package com.fintech.crypto.controller.api;

import com.fintech.crypto.prop.AppProp;
import com.fintech.crypto.request.LoginReq;
import com.fintech.crypto.request.TokenValidationReq;
import com.fintech.crypto.security.JwtProvider;
import com.fintech.crypto.service.domain.IUserSvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth/")
public class Auth {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    AppProp prop;

    @Autowired
    JwtProvider jwtProvider;

    @Autowired
    IUserSvc userSvc;


    //email based
    @PostMapping("signin")
    public ResponseEntity<Map<String, Object>> signIn(@Valid @RequestBody LoginReq request){
        Map<String, Object> res = new HashMap<>();
        try {
            //Goto db through the loadbyUsername func. residing in the class provided in the websecurity config block
            //Compare the details from database against the details provided in the auth token
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

        } catch (BadCredentialsException e){
            throw new UsernameNotFoundException("Invalid credentials. " + e.getMessage());
        }

        //Fetch user details from database alongside with its authorities
        final UserDetails userDetails = userSvc.loadUserByUsername(request.getEmail());

        //Generate a token for the user details
        String token = jwtProvider.createToken(userDetails);
        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("message", "Token is valid for "+Integer.parseInt(prop.EXPIRATION_SECONDS)/3600+"hr(s)");
        res.put("token", token);
        res.put("authority", userSvc.getUserRole(request.getEmail()));

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping(value = "validate/token")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestBody TokenValidationReq request){

        Map<String, Object> res = new HashMap<>();

        String usernameAsPhone = jwtProvider.getUsernameFromToken(request.getToken());
        if (usernameAsPhone == null){
            res.put("status", HttpStatus.FORBIDDEN.value());
            res.put("message", "No user associated with the provided token");
        }else{
            if(!jwtProvider.isTokenExpired(request.getToken())){
                res.put("status", HttpStatus.OK.value());
                res.put("code", HttpStatus.OK);
                res.put("message", "Token is valid");
            }else{
                res.put("status", HttpStatus.NOT_ACCEPTABLE.value());
                res.put("code", HttpStatus.NOT_ACCEPTABLE);
                res.put("message", "Token has expired");
            }
        }

        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
