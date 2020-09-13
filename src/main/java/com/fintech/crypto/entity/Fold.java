package com.fintech.crypto.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.security.KeyGen;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "folds")
@Getter
@Setter
public class Fold extends AbstractEntity{

    @Column(name = "w_key")
    private String wallet;

    @Column(name = "currency", nullable = false)
    @Enumerated(EnumType.STRING)
    private Currency currency;

    @Column(name = "ref", unique = true, updatable = false)
    private String ref;

    @Column(name = "bal", precision = 8)
    private double balance = 0.00000000;

    @Column(name = "ledger_bal", precision = 8)
    private double ledgerBal = 0.00000000;
}
