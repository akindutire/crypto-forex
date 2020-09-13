package com.fintech.crypto.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fintech.crypto.dao.ContractProjection;
import com.fintech.crypto.entity.ContractHistory;
import com.fintech.crypto.entity.User;
import com.fintech.crypto.enums.ContractStatus;
import com.fintech.crypto.security.KeyGen;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
public class ContractWithHistoryDto {

    private String coin;

    private String ref = KeyGen.generate();

    private ContractStatus status;

    private double hashPowerPurchased;

    private double amountInvested;

    private double interestAmountAccumulated = 0;

    private Integer lifeSpan;

    private List<ContractProjection> history;
}
