package com.fintech.crypto.dao;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;


public interface ContractProjection{
    String getNote();
    LocalDateTime getCreatedAt();
    String getModifiedAt();
}
