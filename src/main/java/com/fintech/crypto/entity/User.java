package com.fintech.crypto.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fintech.crypto.security.AppUserRole;
import com.fintech.crypto.security.KeyGen;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
public class User extends AbstractEntity{

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Wallet wallet;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contract> contract = new ArrayList<>();

    private String name;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "username", unique = true)
    private String username;

    @JsonIgnore
    private String password;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private AppUserRole role;

    @Column(name = "is_enabled")
    private Boolean enabled;

    @Column(name = "is_using_2FA")
    private Boolean isUsing2FA = false;

    @Column(name = "secret_for_2fa")
    private String secretFor2FA;

    @Column(name = "referral_key")
    private String referralKey = KeyGen.generateLong(this.name+"&"+this.email);

    @Column(name = "referred_by")
    private String referredByUserEmail;

}
