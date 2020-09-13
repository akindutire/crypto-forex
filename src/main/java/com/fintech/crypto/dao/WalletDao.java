package com.fintech.crypto.dao;

import com.fintech.crypto.entity.User;
import com.fintech.crypto.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WalletDao extends JpaRepository<Wallet, Long> {
    @Query(value = "select w from Wallet w where w.user=:U")
    Wallet findByUser(@Param("U") User u);

    Wallet findByKey(String key);
}
