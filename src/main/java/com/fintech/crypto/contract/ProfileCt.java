package com.fintech.crypto.contract;

import com.fintech.crypto.dto.UserDto;
import com.fintech.crypto.request.BasicProfileModificationReq;

public interface ProfileCt {
    UserDto modifyNonBinaryOfProfile(BasicProfileModificationReq request);
    UserDto showFullProfile(String email);
    UserDto showAnyProfile(String email);
    String enable2FA();
}
