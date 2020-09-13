package com.fintech.crypto.service.domain;

import com.fintech.crypto.contract.CoinCt;
import com.fintech.crypto.dao.CoinDao;
import com.fintech.crypto.dao.CoinRateDao;
import com.fintech.crypto.dto.CoinDto;
import com.fintech.crypto.entity.Coin;
import com.fintech.crypto.entity.CoinRate;
import com.fintech.crypto.entity.User;
import com.fintech.crypto.request.CoinRateReq;
import com.fintech.crypto.request.CoinReq;
import com.fintech.crypto.request.CoinUpdateReq;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ICoinSvc implements CoinCt {

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    CoinDao coinDao;

    @Autowired
    CoinRateDao coinRateDao;


    @Override
    public CoinDto add(CoinReq request) {

        if( coinDao.findByName(request.getName()).isPresent()  ) {
            throw new DuplicateKeyException("Coin already exist");
        }

        if( coinDao.findByCurrency(request.getCurrency()).isPresent()  ) {
            throw new DuplicateKeyException(request.getCurrency() + " already attached to a coin");
        }

        Coin coin = new Coin();
        coin.setName(request.getName());
        coin.setDescription(request.getDescription());
        coin.setCurrency(request.getCurrency());
        coin.setHashPowerUnit(request.getHashPowerUnit());
        coin.setExchangeRateToHashPower(request.getExchangeRateToHashPower());


        CoinRate coinRate = new CoinRate();
        coinRate.setLabel(request.getName());
        coinRate.setMinHashPower(0.00);
        coinRate.setMaxHashPower(0.00);
        coinRate.setMineRate(request.getMineRate());
        coinRate.setCoin(coin);

        coin.getCoinRates().add(coinRate);
        coin.setCoinRates(coin.getCoinRates());

        coin = coinDao.save(coin);

        CoinDto coinDto = new CoinDto();
        BeanUtils.copyProperties(coin, coinDto);
        return coinDto;
    }

    @Override
    public CoinDto toggleMining(String ref) {
        Coin coin = coinDao.findByRef(ref).orElseThrow(
                () -> new IllegalStateException(
                        String.format("Sorry, coin reference %s not found", ref)
                )
        );

        coin.setMineable( !coin.isMineable() );
        coinDao.save(coin);

        CoinDto coinDto = new CoinDto();
        BeanUtils.copyProperties(coin, coinDto);
        return coinDto;
    }

    @Override
    public CoinRate addRate(CoinRateReq request) {

        Coin coin = coinDao.findByRef(request.getRef()).orElseThrow(
                () -> new IllegalStateException(
                        String.format("Sorry, coin reference %s not found", request.getRef())
                )
        );

        if (request.getMaxHashPower() > 0 && (request.getMaxHashPower() < request.getMinHashPower())){
            throw new IllegalStateException("Max hash power must be greater than min hash when max not equals zero");
        }

        CoinRate rate = new CoinRate();
        BeanUtils.copyProperties(request, rate);
        rate.setCoin(coin);

        return coinRateDao.save(rate);
    }

    @Override
    public List<CoinRate> getRates(String ref) {

        Coin coin = coinDao.findByRef(ref).orElseThrow(
                () -> new IllegalStateException(
                        String.format("Sorry, coin ref %s not found", ref)
                )
        );

        return coin.getCoinRates();
    }

    @Override
    public CoinDto update(CoinUpdateReq coinUpdateReq) {

        Coin coin = coinDao.findByRef(coinUpdateReq.getRef()).orElseThrow(
                () -> new IllegalStateException(
                        String.format("Sorry, coin ref %s not found", coinUpdateReq.getRef())
                )
        );

        coin.setName(coinUpdateReq.getName());
        coin.setDescription(coinUpdateReq.getDescription());
        coin.setCurrency(coinUpdateReq.getCurrency());
        coin.setHashPowerUnit(coinUpdateReq.getHashPowerUnit());
        coin.setExchangeRateToHashPower(coinUpdateReq.getExchangeRateToHashPower());


        coinDao.save(coin);

        CoinDto coinDto = new CoinDto();
        BeanUtils.copyProperties(coin, coinDto);
        return coinDto;
    }

    @Override
    public List<CoinDto> fetchByMineable(boolean mineable) {

        List<Coin> coins = coinDao.findByMineable(mineable);

        List<CoinDto> disposableCoin = new ArrayList<>();

        coins.forEach( (coin) -> {
            CoinDto coinDto = new CoinDto();
            BeanUtils.copyProperties(coin, coinDto);
            disposableCoin.add(coinDto);
        } );

        return disposableCoin;
    }

    @Override
    public List<CoinDto> fetch() {

        List<Coin> coins = coinDao.findAll();

        return coins.stream().map( (c) -> modelMapper.map(c, CoinDto.class) ).collect(Collectors.toList());
    }

    @Override
    public List<CoinDto> query(String ref) {
        Coin coin = coinDao.findByRef(ref).orElseThrow(
                () -> new IllegalStateException(
                        String.format("Sorry, coin refed %s not found", ref)
                )
        );
        List<Coin> c = new ArrayList<>();
        c.add(coin);

        return c.stream().map(  coin1 ->  modelMapper.map(coin1, CoinDto.class)).collect(Collectors.toList());
    }

    @Override
    public List<CoinDto> query() {
        List<Coin> coins = coinDao.findAll();
        return coins.stream().map( (c) -> modelMapper.map(c, CoinDto.class) ).collect(Collectors.toList());
    }
}
