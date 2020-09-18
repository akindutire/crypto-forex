package com.fintech.crypto.contract;

public interface TotpManagerCt {
    String generateSecret();
    String getUriForImage(String secret);
    boolean verifyCode(String code, String secret);
}
