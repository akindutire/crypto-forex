package com.fintech.crypto.contract;

import com.fintech.crypto.dto.CoinDto;
import com.fintech.crypto.entity.CoinRate;
import com.fintech.crypto.request.CoinRateReq;
import com.fintech.crypto.request.CoinReq;
import com.fintech.crypto.request.CoinUpdateReq;

import java.util.List;

public interface CoinCt {

    CoinDto add(CoinReq request);
    CoinDto toggleMining(String ref);
    CoinRate addRate(CoinRateReq request);
    List<CoinRate> getRates(String ref);
    CoinDto update(CoinUpdateReq coinUpdateReq);
    List<CoinDto> fetchByMineable(boolean mineable);
    List<CoinDto> fetch();
    List<CoinDto> query(String name);
    List<CoinDto> query();
}
