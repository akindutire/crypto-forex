package com.fintech.crypto.contract;

import java.util.List;
import java.util.Map;

public interface BlockIoCryptoProviderCt extends CryptoProvider{
    String getRandomAddress(double expectedAmount);
    Map<String, Object> withdraw(double amount, List<String> address);
    Boolean probePayment(String paymentAddress);
    Double getBalance(String address);
    List<String> getAddresses();
    Boolean archiveAddress(List<String> address);
    Boolean unArchiveAddress(List<String> address);
}
