package com.fintech.crypto.dao;

import com.fintech.crypto.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDao extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);

    @Query("select u.role from User u where u.email=:E")
    String findByEmailQ(@Param("E") String email);

    @Query("select u from User u where u.referralKey=:R")
    Optional<User> findEmailByReferralKey(@Param("R") String refKey);

}
