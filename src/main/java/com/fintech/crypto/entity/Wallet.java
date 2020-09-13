package com.fintech.crypto.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.security.KeyGen;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "wallets")
@Getter
@Setter
public class Wallet extends AbstractEntity{

    @JsonIgnore
    @OneToOne(targetEntity = User.class, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "wallet_key", unique = true, updatable = false)
    private String key = KeyGen.generate();

    @Column(name = "w_currency", nullable = false)
    @Enumerated(EnumType.STRING)
    private Currency targetCurrency;

    @Column(name = "withdrawal_address")
    private String withdrawalAddress;
}
