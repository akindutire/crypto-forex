package com.fintech.crypto.contract;

import com.fintech.crypto.request.PasswordResetReq;
import com.fintech.crypto.response.PasswordResetVerificationTokenCreationRes;

public interface PasswordResetCt {
    PasswordResetVerificationTokenCreationRes acquirePasswordResetVerificationToken(String email);
    Boolean resetPassword(PasswordResetReq request);
}
