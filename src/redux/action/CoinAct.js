import {fetchCurrencies ,fetchCoins, addCoin, fetchAllCoins, fetchRates, findACoin, appendOrUpdateRate, updateCoin, toggleMineable, fetchFold} from '../service/CoinSvc';



export const selectCoinToMine = (data) => {


    sessionStorage.setItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425$COIN_TO_MINE", JSON.stringify(data));

    return {
        type: "SELECT_COIN_TO_MINE"
    };
};

export const selectAWalletFold = (currency, sesReqToken) => {
 //Hit the server
    return async (dispatch) => {

        const res = await fetchFold(currency, sesReqToken);

        console.log("get currencies feedback", res);

        dispatch({
                type: "FETCH_WALLET_FOLD_FOR_A_CURRENCY",
                payload: res
        });
    }
};

export const getCurrencies = (sesReqToken) => {
    //Hit the server
    return async (dispatch) => {

        const res = await fetchCurrencies(sesReqToken);

        console.log("get currencies feedback", res);

        dispatch({
                type: "FETCH_COIN_CURRENCIES",
                payload: res
            });
    }
};

export const getMinableCoins = (sesReqToken) => {
    //Hit the server
    return async (dispatch) => {

        const res = await fetchCoins(sesReqToken);

        console.log("get minable feedback", res);

        dispatch({
                type: "FETCH_MINABLE_COIN",
                payload: res
            });
    }
    // return {
    //     type: "FETCH_MINABLE_COIN",
    //     payload: [ { key : 'ETH', name: 'Ethereum mining' } , {key : 'BTC', name: 'Bitcoin mining'}, {key : 'DOGE', name: 'Doge mining'}, {key : 'LTC', name: 'Litecoin mining'} ]
    // };
};

export const getAllCoins = (sesReqToken) => {
    //Hit the server
    return async (dispatch) => {

        const res = await fetchAllCoins(sesReqToken);

        console.log("get all coins feedback", res);

        dispatch({
                type: "FETCH_ALL_COIN",
                payload: res
            });
    }
};

export const addACoin = (request) => {
    //Hit the server
    return async (dispatch) => {

        const res = await addCoin(request);

        console.log("get minable feedback", res);

        dispatch({
                type: "ADD_COIN",
                payload: res
            });
    }
};

export const fetchACoin = (ref, sesReqToken) => {
    //Hit the server
    return async (dispatch) => {

        const res = await findACoin(ref, sesReqToken);

        console.log("get minable feedback", res);

        dispatch({
                type: "FETCH_A_COIN",
                payload: res
            });
    }
};

export const fetchACoinRates = (sesReqToken) => {
    //Hit the server
    return async (dispatch) => {

        const res = await fetchRates(sesReqToken);

        console.log("get minable feedback", res);

        dispatch({
                type: "FETCH_A_COIN_RATES",
                payload: res
            });
    }
};

export const editOrAddRate = (sesReqToken) => {
    //Hit the server
    return async (dispatch) => {

        const res = await appendOrUpdateRate(sesReqToken);

        console.log("get minable feedback", res);

        dispatch({
                type: "EDIT_OR_ADD_A_COIN_RATE",
                payload: res
            });
    }
};

export const updateACoin = (sesReqToken) => {
    //Hit the server
    return async (dispatch) => {

        const res = await updateCoin(sesReqToken);

        console.log("get minable feedback", res);

        dispatch({
                type: "EDIT_A_COIN",
                payload: res
            });
    }
};

export const toggleACoinMiningStatus = (sesReqToken) => {
    //Hit the server
    return async (dispatch) => {

        const res = await toggleMineable(sesReqToken);

        console.log("get minable feedback", res);

        dispatch({
                type: "TOGGLE_A_COIN_MINING_STATUS",
                payload: res
            });
    }
};