package com.fintech.crypto.dao;

import com.fintech.crypto.entity.CryptoProviderAddress;
import com.fintech.crypto.enums.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CryptoProviderAddressDao extends JpaRepository<CryptoProviderAddress, Long> {
    Optional<CryptoProviderAddress> findByAddress(String Address);
    List<CryptoProviderAddress> findByStatus(String status);

    @Query(value = "select c from CryptoProviderAddress c where c.status != :S")
    List<CryptoProviderAddress> findByInverseStatus(@Param("S") String status);
}
