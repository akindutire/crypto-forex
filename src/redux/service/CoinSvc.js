import {AuthorizedCryptoFxApi, getToken } from './FxApi';

export const addCoin = (body) => {

    return AuthorizedCryptoFxApi.post("/coin/add", JSON.stringify(body),{
        headers:{
            'Authorization': `Bearer ${getToken()}`
        }
    }); 
}

export const fetchCurrencies = (sesReqToken) => {
  
    return AuthorizedCryptoFxApi.get("/coin/currencies",{
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        cancelToken: sesReqToken
    });
}

export const fetchCoins = (sesReqToken) => {
  
    return AuthorizedCryptoFxApi.get("/coin/fetch",{
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        cancelToken: sesReqToken,
        params:{
            mineable: "1"
        }
    });
}

export const fetchAllCoins = (sesReqToken) => {
    return AuthorizedCryptoFxApi.get("/coin/fetch-all",{
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        cancelToken: sesReqToken
    });
}

export const fetchRates = (ref, sesReqToken) => {
    return AuthorizedCryptoFxApi.get("/coin/fetch-rates",{
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        params:{
            "coin-ref": ref
        },
        cancelToken: sesReqToken
    });
}

export const findACoin = (ref, sesReqToken) => {
    return AuthorizedCryptoFxApi.get("/coin/query", {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        params:{
            ref
        },
        cancelToken: sesReqToken
    });
}

export const appendOrUpdateRate = (body) => {
    return AuthorizedCryptoFxApi.post("/coin/append-rate", JSON.stringify(body),{
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
    });
    
}

export const updateCoin = (body) => {
    return AuthorizedCryptoFxApi.put("/coin/update", JSON.stringify(body),{
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
    });
    
}

export const toggleMineable = (ref, sesReqToken) => {
    return AuthorizedCryptoFxApi.put("/coin/toggle-mining-status", {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        params:{
            ref
        },
        cancelToken: sesReqToken
    });
    
}

export const fetchFold = (currency, sesReqToken) => {
    return AuthorizedCryptoFxApi.get("/coin/fetch-fold", {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        params:{
            'currency': currency
        },
        cancelToken: sesReqToken
    });
}