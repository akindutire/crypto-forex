package com.fintech.crypto.contract;

import com.fintech.crypto.dto.ContractWithHistoryDto;
import com.fintech.crypto.entity.Contract;
import com.fintech.crypto.enums.Currency;
import com.fintech.crypto.request.ContractCreactionReq;

import java.util.List;

public interface ContractCt {

    List<ContractWithHistoryDto> myContractsForACurrency(Currency c);
    Contract create(Currency currency, String paymentAddress);
    List<Contract> fetch();
    Contract release(String ref);
    Contract renew(String ref);
}
