package com.fintech.crypto.dao;

import com.fintech.crypto.entity.TwoFASession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TwoFaDao extends JpaRepository<TwoFASession, Long> {
}
