package com.fintech.crypto.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "rules")
public class Rule extends AbstractEntity {

    @Column(name = "r_key", unique = true)
    private String key;

    @Column(name = "value")
    private String value;

}
