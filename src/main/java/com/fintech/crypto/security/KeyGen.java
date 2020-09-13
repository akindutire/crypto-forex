package com.fintech.crypto.security;

import com.fintech.crypto.context.DataLounge;
import org.springframework.security.core.token.Sha512DigestUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

@Service
public class KeyGen {
    public static String generate(){
        //Current Milli from a particular user action

        String k = System.currentTimeMillis() + DataLounge.currentUserRecognizedByUniqueKey;
        return DigestUtils.md5DigestAsHex(k.getBytes());

    }

    public static String generateLong(String extra){
        //Current Milli from a particular user action

        String k = System.currentTimeMillis() + DataLounge.currentUserRecognizedByUniqueKey + extra;
        return Sha512DigestUtils.shaHex(k.getBytes());

    }
}
