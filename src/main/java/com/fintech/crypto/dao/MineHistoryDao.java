package com.fintech.crypto.dao;

import com.fintech.crypto.entity.Contract;
import com.fintech.crypto.entity.MineHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.persistence.OrderBy;
import java.util.List;

@Repository
public interface MineHistoryDao extends JpaRepository<MineHistory, Long> {

    List<MineHistory> findByContract(Contract c);
}
