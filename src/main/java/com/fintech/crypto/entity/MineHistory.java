package com.fintech.crypto.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnoreType;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "mine_histories")
@JsonIgnoreProperties({"contract"})
@Getter
@Setter
public class MineHistory extends AbstractEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", referencedColumnName = "c_ref")
    private Contract contract;

    @Column(name = "amount_mined", precision = 8)
    private double amountMined;

    public void setContract(Contract contract) {
        this.contract = contract;
    }

    public double getAmountMined() {
        return amountMined;
    }

    public void setAmountMined(double amountMined) {
        this.amountMined = amountMined;
    }

}
