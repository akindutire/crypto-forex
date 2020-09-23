import {AuthorizedCryptoFxApi, getToken } from './FxApi';

export const initiateContractViaPaymentSetup = (currency, expectedCryptoVal) => {
    return AuthorizedCryptoFxApi.post("/contract/generate/address/to/pay/hashpower", JSON.stringify({currency, expectedAmount: expectedCryptoVal}), {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        }
    });
}

export const probePayment = (currency, paymentAddress) => {
    return AuthorizedCryptoFxApi.post("/contract/probe/hashpowerpurchase", JSON.stringify({currency, paymentAddress}), {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        }
    });
}

export const unfulfilledPaymentExpectation = (currency, sesReqToken) => {
    return AuthorizedCryptoFxApi.get("/contract/fetch/unfufilled/payment/expectation", {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        params:{
            'currency': currency
        },
        cancelToken: sesReqToken
    });
}

export const fetchContractsByCurrencyOfAFold = (currency, sesReqToken) => {
    console.log(sesReqToken);
    return AuthorizedCryptoFxApi.get("/contract/fetch", {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        params:{
            'currency': currency
        },
        cancelToken: sesReqToken
    });
}

export const fetchContracts = (sesReqToken) => {
    return AuthorizedCryptoFxApi.get("/contract/fetch", {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        cancelToken: sesReqToken
    });
}

export const contractRelease = (ref, sesReqToken) => {
    return AuthorizedCryptoFxApi.get("/contract/release", {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        params:{
            'ref': ref
        },
        cancelToken: sesReqToken
    });
}

export const contractRenewal = (ref, sesReqToken) => {
    return AuthorizedCryptoFxApi.get("/contract/renew", {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        params:{
            'ref': ref
        },
        cancelToken: sesReqToken
    });
}

export const moveFundsToAWalletFold = (currency, ref, amount) => {
    return AuthorizedCryptoFxApi.post("/contract/move/funds/to/fold", JSON.stringify({ amount, currency, ref}), {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        }
    });
}