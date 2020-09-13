package com.fintech.crypto.dao;

import com.fintech.crypto.entity.Coin;
import com.fintech.crypto.enums.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoinDao extends JpaRepository<Coin, Long> {

    List<Coin> findByMineable(boolean mineable);
    Optional<Coin> findByName(String name);
    Optional<Coin> findByRef(String ref);
    Optional<Coin> findByCurrency(Currency currency);
}
