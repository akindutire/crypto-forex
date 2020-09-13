package com.fintech.crypto.entity;

import org.joda.time.DateTime;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@MappedSuperclass
public class AbstractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(name = "created_at", updatable = false, nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

    @Column(name = "modified_at", nullable = false, updatable = true)
    @Temporal(TemporalType.TIMESTAMP)
    private Date modifiedAt = new Date();

    public LocalDateTime getCreatedAt(){
        Instant t = this.createdAt.toInstant();

        return LocalDateTime.ofInstant(t, ZoneId.systemDefault());
    }

    public LocalDateTime getModifiedAt(){
        Instant t = this.modifiedAt.toInstant();

        return LocalDateTime.ofInstant(t, ZoneId.systemDefault());
    }

    public void setModifiedAt(){
        this.modifiedAt = new Date();
    }

}
