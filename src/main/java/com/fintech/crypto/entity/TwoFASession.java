package com.fintech.crypto.entity;

import com.fintech.crypto.security.KeyGen;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "two_fa_sessions")
@Getter
@Setter
public class TwoFASession extends AbstractEntity{
    @Column(name = "token", unique = true, updatable = false)
    private String token = KeyGen.generateLong(this.email);

    private String email;
}
