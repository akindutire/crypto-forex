package com.fintech.crypto.contract;

import com.fintech.crypto.dto.UserDto;
import com.fintech.crypto.request.BasicProfileModificationReq;
import com.fintech.crypto.request.MFASetup;

public interface ProfileCt {
    UserDto modifyNonBinaryOfProfile(BasicProfileModificationReq request);
    UserDto showFullProfile(String email);
    UserDto showAnyProfile(String email);
    MFASetup enable2FA();
    Boolean disable2FA();
}
