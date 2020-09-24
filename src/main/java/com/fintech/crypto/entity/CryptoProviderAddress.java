package com.fintech.crypto.entity;

import com.fintech.crypto.enums.CryptoAddressPurpose;
import com.fintech.crypto.enums.CryptoAddressVendor;
import com.fintech.crypto.enums.Currency;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "crypto_addresses")
@Getter
@Setter
public class CryptoProviderAddress extends AbstractEntity{

    @OneToOne
    @JoinColumn
    private User user;

    @Column(name = "address", unique = true, nullable = false)
    private String address;

    @Column(name = "expected_amount", nullable = false)
    private double expectedAmount;

    @Column(name = "reserved_amount", nullable = false)
    private double reservedAmount = 0;

    @Column(name = "purpose", updatable = false)
    @Enumerated(EnumType.STRING)
    private CryptoAddressPurpose purpose;

    @Column(name = "currency", updatable = false)
    @Enumerated(EnumType.STRING)
    private Currency currency;

    @Column(name = "vendor", updatable = false)
    @Enumerated(EnumType.STRING)
    private CryptoAddressVendor vendor;

    @Column(name = "status")
    private String status;

    @Column(name = "nonce")
    private String nonce;
}
