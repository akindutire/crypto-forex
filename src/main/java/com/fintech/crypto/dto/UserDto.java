package com.fintech.crypto.dto;

import com.fintech.crypto.security.AppUserRole;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@Getter
@Setter
public class UserDto {
    private String name;
    private String email;
    private AppUserRole role;
    private LocalDateTime createdAt;
    private Map<String, Double> coinMined;
    private Map<String, Double> coinMinedPerDay;
    private Map<String, Integer> contractCount;
    private Map<String, Map<String, Double>> lastPurchaseAndWithdrawal;

    private String withdrawalAddress;
//    private Wallet wallet;

}
