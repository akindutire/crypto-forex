package com.fintech.crypto.contract;

public interface Email {
    void send(String subject, String header1, String header2, String message, String from, String to);
}
