export const walletAddressToWithdrawTo = (state = [], action) => {
    //not in use
    if(action.type == "FETCH_WALLET_ADDRESS_WITHDRAW_TO"){
        return action.payload;
    }
    return state;
}

export const withdrawalReceipt = (state = [], action) => {

    if(action.type == "WITHDRAW"){
        return action.payload;
    }

    return state;
}


export const paymentReceipt = (state = [], action) => {

    if(action.type == "PROBE_PAYMENT"){
        return action.payload;
    }

    return state;
}

export const walletAddressToPayTo = (state = [], action) => {

    if(action.type == "FETCH_WALLET_ADDRESS_TO_PAY_TO"){
        return action.payload;
    }

    return state;
}

export const coinSelected = (state = "", action) => {

    if(action.type == "SELECT_COIN_TO_MINE"){
        const data = sessionStorage.getItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425$COIN_TO_MINE");
        return JSON.parse(data);
    }

    if(sessionStorage.getItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425$COIN_TO_MINE") == null){
        return state;
    }else{
        const data = sessionStorage.getItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425$COIN_TO_MINE");
        return JSON.parse(data);
    }
}

export const minableCoin = (state = [], action) => {

    if(action.type == "FETCH_MINABLE_COIN"){
        return action.payload;
    }

    return state;
}

export const currencies = (state = [], action) => {

    if(action.type == "FETCH_COIN_CURRENCIES"){
        return action.payload;
    }

    return state;
}

export const allCoinsReceipt = (state = [], action) => {

    if(action.type == "FETCH_ALL_COIN"){
        return action.payload;
    }

    return state;
}

export const addCoinReceipt = (state = [], action) => {

    if(action.type == "ADD_COIN"){
        return action.payload;
    }

    return state;
}

export const aCoinReceipt = (state = [], action) => {

    if(action.type == "FETCH_A_COIN"){
        return action.payload;
    }

    return state;
}

export const aCoinRateReceipt = (state = [], action) => {

    if(action.type == "FETCH_A_COIN_RATES"){
        return action.payload;
    }

    return state;
}

export const editOrAddACoinRateReceipt = (state = [], action) => {
    if(action.type == "EDIT_OR_ADD_A_COIN_RATE"){
        return action.payload;
    }
    return state;
}

export const editACoinReceipt = (state = [], action) => {
    if(action.type == "EDIT_A_COIN"){
        return action.payload;
    }
    return state;
}

export const toggleACoinReceipt = (state = [], action) => {
    if(action.type == "TOGGLE_A_COIN_MINING_STATUS"){
        return action.payload;
    }

    return state;
}

export const walletFoldForACurrency = (state = [], action) => {
    if(action.type == "FETCH_WALLET_FOLD_FOR_A_CURRENCY"){
        return action.payload;
    }

    return state;
}

export const contractForAFoldThroughCurrency = (state = [], action) => {
    if(action.type == "FETCH_CONTRACTS_FOR_A_FOLD_THROUGH_CURRENCY"){
        return action.payload;
    }
    return state;
}

export const unfulfilledPaymentExpectation = (state = [], action) => {
    if(action.type == "FETCH_UNFULFILLED_PAYMENT_EXPECTATION"){
        return action.payload;
    }
    return state;
}

export const contractRenewalReceipt = (state = [], action) => {
    if(action.type == "RENEW_CONTRACT"){
        return action.payload;
    }
    return state;
}

export const contractReleaseReceipt = (state = [], action) => {
    if(action.type == "RELEASE_CONTRACT"){
        return action.payload;
    }
    return state;
}

export const fundMovementOutOfContractReceipt = (state = [], action) => {
    if(action.type == "MOVE_FUNDS_TO_FOLD"){
        return action.payload;
    }
    return state;
}

export const fetchTransactionsReceipt = (state = [], action) => {
    if(action.type == "FETCH_TRANSACTIONS"){
        return action.payload;
    }
    return state;
}

//admin
export const fetchUsersWithdrawalTransactionsReceipt = (state = [], action) => {
    if(action.type == "FETCH_USERS_WITHDRAWAL_TRANSACTIONS"){
        return action.payload;
    }
    return state;
}


//admin
export const doApproveWithrawalRequestReceipt = (state = [], action) => {
    if(action.type == "APPROVE_USER_WITHDRAWAL_TRANSACTION"){
        return action.payload;
    }
    return state;
}