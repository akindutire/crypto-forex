package com.fintech.crypto.service.utility;

import com.fintech.crypto.contract.TotpManagerCt;
import org.springframework.stereotype.Service;

@Service
public class TotpSvc implements TotpManagerCt {
    @Override
    public String generateSecret() {
        return null;
    }

    @Override
    public String getUriForImage(String secret) {
        return null;
    }

    @Override
    public boolean verifyCode(String code, String secret) {
        return false;
    }
}
