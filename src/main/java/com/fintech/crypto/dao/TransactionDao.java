package com.fintech.crypto.dao;

import com.fintech.crypto.entity.Contract;
import com.fintech.crypto.entity.ContractHistory;
import com.fintech.crypto.entity.Fold;
import com.fintech.crypto.entity.Transaction;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionDao extends JpaRepository<Transaction, Long> {
    @Query(value = "select t from Transaction t where t.contract=:C and t.type=:T")
    List<Transaction> findByContract(@Param("C") Contract contract, @Param("T") TransactionType type);

    @Query(value = "select t from Transaction t where t.currency=:C and (t.from=:F or t.to=:F)")
    List<Transaction> findByCurrency(@Param("C") Currency contract, @Param("F") String fold);

    @Query(value = "select t from Transaction t where t.currency=:C and (t.from=:F or t.to=:F) and t.type=:T")
    List<Transaction> findByCurrency(@Param("C") Currency contract, @Param("F") String fold, @Param("T") TransactionType type);

    @Query(value = "select t from Transaction t where t.currency=:C and t.type=:T")
    List<Transaction> findByCurrency(@Param("C") Currency contract, @Param("T") TransactionType type);

    List<Transaction> findByType(TransactionType type);

    Optional<Transaction> findByRef(String ref);
}
