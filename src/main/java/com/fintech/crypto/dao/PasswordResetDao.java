package com.fintech.crypto.dao;

import com.fintech.crypto.entity.PasswordResetSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetDao extends JpaRepository<PasswordResetSession, Long> {
    Optional<PasswordResetSession> findByEmail(String email);
    Optional<PasswordResetSession> findByToken(String token);
}
