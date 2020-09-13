package com.fintech.crypto.service.domain;

import com.fintech.crypto.contract.TransactionCt;
import com.fintech.crypto.dao.FoldDao;
import com.fintech.crypto.dao.TransactionDao;
import com.fintech.crypto.entity.Fold;
import com.fintech.crypto.entity.Transaction;
import com.fintech.crypto.entity.User;
import com.fintech.crypto.entity.Wallet;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.enums.TransactionType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ITnxSvc implements TransactionCt {

    @Autowired
    TransactionDao transactionDao;

    @Autowired
    FoldDao foldDao;

    @Autowired
    IUserSvc userSvc;

    @Autowired
    IWalletSvc walletSvc;

    @Override
    public Transaction query(String reference) {
        return transactionDao.findByRef(reference).orElseThrow( () -> new IllegalStateException("transaction not found"));
    }

    @Override
    public Transaction commit(Transaction tnx) {
        return null;
    }

    @Override
    public List<Transaction> getTnx(Currency currency, String tnxBound) {
        Fold f = walletSvc.getRawFold(currency.toString());
        List<Transaction> t = transactionDao.findByCurrency(currency, f.getRef());
        Collections.reverse(t);

        return t;
    }

    //For all user: exclusive to admin
    public List<Transaction> getAllWithdrawalTnx(Currency currency) {
        List<Transaction> w = transactionDao.findByCurrency(currency, TransactionType.WITHDRAWAL);

        Collections.reverse(w);

        return w;
    }

    @Override
    public List<Transaction> getTnx(Currency currency) {

        return null;
    }

    @Override
    public void auditTnx() {

    }
}
