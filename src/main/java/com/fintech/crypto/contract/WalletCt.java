package com.fintech.crypto.contract;

import com.fintech.crypto.dto.FoldDto;
import com.fintech.crypto.entity.Fold;
import com.fintech.crypto.entity.Transaction;
import com.fintech.crypto.entity.User;
import com.fintech.crypto.entity.Wallet;
import com.fintech.crypto.enums.Currency;

public interface WalletCt {
    Wallet create();
    Wallet read();
    Fold createFold(Currency currency, Wallet wallet);
    FoldDto getFold(String coinRef);
    Transaction withdraw(Currency currency, double amount, String address);
}
