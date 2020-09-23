import {AuthorizedCryptoFxApi, getToken } from './FxApi';

export const withdrawFund = (body) => {
    return AuthorizedCryptoFxApi.post("/user/withdraw/fund", JSON.stringify({ currency: body.currency, amount: body.amount, address: body.address}), {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        }
    });
}

export const fetchTransactions = (currency, sesReqToken) => {
    return AuthorizedCryptoFxApi.get("/user/transactions", {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        params:{
            'currency': currency
        },
        cancelToken: sesReqToken
    });
}

//admin feature
export const fetchAllWithdrawals = (currency, sesReqToken) => {
    return AuthorizedCryptoFxApi.get("/user/all/withdrawals", {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        params:{
            'currency': currency
        },
        cancelToken: sesReqToken
    });
}

//admin feature
export const approveWithrawalRequest = (ref) => {
    return AuthorizedCryptoFxApi.put("/user/withdraw/approval", JSON.stringify({ tnxRef:ref}), {
        headers:{
            'Authorization': `Bearer ${getToken()}`
        }
    });
}

