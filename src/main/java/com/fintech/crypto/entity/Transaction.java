package com.fintech.crypto.entity;

import com.fintech.crypto.enums.*;
import com.fintech.crypto.security.KeyGen;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "transactions")
@Getter
@Setter
public class Transaction extends AbstractEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", referencedColumnName = "c_ref")
    private Contract contract;

    @Column(name = "tnx_ref", unique = true, updatable = false)
    private String ref = KeyGen.generateLong(this.currency+""+this.from+""+this.to);

    @Column(name = "from_type", updatable = false)
    @Enumerated(EnumType.STRING)
    private FundSource fromType;

    //from fold/other address goes inside here
    @Column(name = "from_address", updatable = false)
    private String from;

    @Column(name = "to_type", updatable = false)
    @Enumerated(EnumType.STRING)
    private FundSource toType;

    //to fold/other address goes inside here
    @Column(name = "to_address", updatable = false)
    private String to;

    @Column(name = "tnx_currency", updatable = false)
    @Enumerated(EnumType.STRING)
    private Currency currency;

    private double amount;

    @Column(name = "note", nullable = false)
    private String note;

    @Column(name = "tnx_status")
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    @Column(name = "tnx_mode")
    @Enumerated(EnumType.STRING)
    private TransactionMode mode;

    @Column(name = "tnx_type")
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @Column(name = "nonce", nullable = false)
    private String nonce;
}
