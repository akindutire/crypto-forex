package com.fintech.crypto.dao;

import com.fintech.crypto.entity.Fold;
import com.fintech.crypto.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoldDao extends JpaRepository<Fold, Long> {

    @Query(value = "select f from Fold f where f.wallet=:K")
    List<Fold> findByWK(@Param("K") String k);

    Fold findByRef(String ref);

}
