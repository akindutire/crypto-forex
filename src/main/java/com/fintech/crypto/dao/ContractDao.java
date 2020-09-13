package com.fintech.crypto.dao;

import com.fintech.crypto.entity.Contract;
import com.fintech.crypto.entity.User;
import com.fintech.crypto.enums.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractDao extends JpaRepository<Contract, Long> {

    @Query(value = "select c from Contract c join Coin ci on c.coin=ci.ref where ci.currency=:C and c.user=:U")
    List<Contract> findContract(@Param("C") Currency currency, @Param("U") User user);

    Optional<Contract> findByRef(String ref);
}
