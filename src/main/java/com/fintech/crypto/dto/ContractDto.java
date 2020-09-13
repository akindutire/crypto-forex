package com.fintech.crypto.dto;

import com.fintech.crypto.enums.ContractStatus;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;

@Getter
@Setter
public class ContractDto {

    private ContractStatus status;

    private double hashPowerPurchased;

    private double amountInvested;
}
