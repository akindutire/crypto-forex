package com.fintech.crypto.entity;

import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.security.KeyGen;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "minable_coins")
@Getter
@Setter
public class Coin extends AbstractEntity{

    @OneToMany(mappedBy = "coin", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<CoinRate> coinRates = new ArrayList<>();

    @Column(name = "c_ref", updatable = false, unique = true)
    private String ref = KeyGen.generateLong(this.name);

    @Column(name = "c_name", unique = true)
    private String name;

    @Column(name = "c_description")
    private String description;

    @Column(name = "currency", unique = true)
    @Enumerated(EnumType.STRING)
    private Currency currency;

    @Column(name = "is_mineable")
    private boolean mineable = true;

    @Column(name = "hash_power_unit")
    private String hashPowerUnit;

    @Column(name = "exchange_rate_to_hash_power", nullable = false, precision = 3)
    private double exchangeRateToHashPower;
}
