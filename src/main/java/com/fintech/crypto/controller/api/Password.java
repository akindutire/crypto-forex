package com.fintech.crypto.controller.api;

import com.fintech.crypto.prop.AppProp;
import com.fintech.crypto.request.PasswordResetReq;
import com.fintech.crypto.response.PasswordResetVerificationTokenCreationRes;
import com.fintech.crypto.service.domain.IUserSvc;
import com.fintech.crypto.service.utility.PasswordResetSvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/password/")
public class Password {

    @Autowired
    IUserSvc userSvc;

    @Autowired
    PasswordResetSvc passwordResetSvc;

    @Autowired
    AppProp prop;

    @GetMapping("acquire/verification/token/{email}")
    public ResponseEntity<Map<String, Object>> acquireVerificationToken(@Valid @PathVariable(name = "email") String email){

        Map<String, Object> res = new HashMap<>();

        PasswordResetVerificationTokenCreationRes data = passwordResetSvc.acquirePasswordResetVerificationToken(email);
        res.put("message", "Reset token has been sent");
        res.put("status", HttpStatus.OK.value());
        res.put("code", HttpStatus.OK);
        res.put("data", data);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PutMapping("reset")
    public ResponseEntity<Map<String, Object>> Reset(@Valid @RequestBody PasswordResetReq request){
        Map<String, Object> res = new HashMap<>();

        if (passwordResetSvc.resetPassword(request)) {
            res.put("message", "Password changed");
            res.put("status", HttpStatus.OK.value());
            res.put("code", HttpStatus.OK);
        }
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

}
