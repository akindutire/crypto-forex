package com.fintech.crypto.contract;

import com.fintech.crypto.entity.Transaction;
import com.fintech.crypto.enums.Currency;

import java.util.List;

public interface TransactionCt {
    Transaction query(String reference);
    Transaction commit(Transaction tnx);
    List<Transaction> getTnx(Currency currency, String tnxBound);
    List<Transaction> getTnx(Currency currency);

    void auditTnx();
}
