package com.fintech.crypto.dao;

import com.fintech.crypto.entity.Rule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RuleDao extends JpaRepository<Rule, Long> {
}
