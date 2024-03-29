package com.fintech.crypto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class FundWithdrawalApproveReq {
    @NotBlank
    private String tnxRef;
}
