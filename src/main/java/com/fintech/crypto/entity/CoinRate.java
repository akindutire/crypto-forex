package com.fintech.crypto.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "coin_rates")
@Getter
@Setter
public class CoinRate extends AbstractEntity {

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "coin_id", referencedColumnName = "id")
    private Coin coin;

    @Column(name = "label", unique = true)
    private String label;

    @Column(name = "mine_rate", nullable = false, precision = 3)
    private double mineRate;

    @Column(name = "min_hash_power", nullable = false, precision = 3)
    private double minHashPower;

    @Column(name = "max_hash_power", nullable = false, precision = 3)
    private double maxHashPower;

}
