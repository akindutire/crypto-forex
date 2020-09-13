package com.fintech.crypto.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fintech.crypto.enums.ContractStatus;
import com.fintech.crypto.security.KeyGen;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contracts")
@Getter
@Setter
public class Contract extends AbstractEntity implements Serializable {

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "coin_ref", nullable = false)
    private String coin;

    @Column(name = "c_ref", updatable = false, unique = true)
    private String ref = KeyGen.generate();

    @Column(name = "c_status")
    @Enumerated(EnumType.STRING)
    private ContractStatus status;

    @Column(name = "hash_power_purchased", precision = 8)
    private double hashPowerPurchased;

    @Column(name = "amount_invested", precision = 8)
    private double amountInvested;

    @Column(name = "interest_amount_accumulated", precision = 8)
    private double interestAmountAccumulated = 0;

    @Column(name = "life_span")
    private Integer lifeSpan = 365;

}
