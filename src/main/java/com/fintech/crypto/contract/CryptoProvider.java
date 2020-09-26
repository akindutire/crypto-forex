package com.fintech.crypto.contract;

public interface CryptoProvider {
    String getRandomAddress(double expectedAmount);
    Boolean probePayment(String paymentAddress);
    Double getBalance(String address);
}
