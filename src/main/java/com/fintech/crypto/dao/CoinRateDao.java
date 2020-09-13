package com.fintech.crypto.dao;

import com.fintech.crypto.entity.CoinRate;
import com.fintech.crypto.entity.Coin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoinRateDao extends JpaRepository<CoinRate, Long> {

    List<CoinRate> findByCoin(Coin c);
}
