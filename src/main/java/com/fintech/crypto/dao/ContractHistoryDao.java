package com.fintech.crypto.dao;

import com.fintech.crypto.entity.Contract;
import com.fintech.crypto.entity.ContractHistory;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContractHistoryDao extends JpaRepository<ContractHistory, Long> {

    @Query(value = "select note, created_at, modified_at from contract_histories where contract_ref=:C", nativeQuery = true)
    List<ContractProjection> findOnlyNoteByContract(@Param("C") String contract_ref);

    List<ContractHistory> findByContract(Contract contract);
}

