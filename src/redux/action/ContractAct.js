import { fetchContracts, fetchContractsByCurrencyOfAFold, contractRenewal, contractRelease, moveFundsToAWalletFold } from './../service/ContractSvc';

export const getContracts = (sesReqToken) => {
    //Hit the server
    return async (dispatch) => {

        const res = await fetchContracts(sesReqToken);

        console.log("get currencies feedback", res);

        dispatch({
            type: "FETCH_CONTRACTS",
            payload: res
        });
    }
};

export const getContractsForAFold = (currency, sesReqToken) => {
    //Hit the server
    return async (dispatch) => {

        const res = await fetchContractsByCurrencyOfAFold(currency, sesReqToken);

        console.log("get contracts feedback", res);

        dispatch({
            type: "FETCH_CONTRACTS_FOR_A_FOLD_THROUGH_CURRENCY",
            payload: res
        });
    }
};

export const renewContract = (ref, sesReqToken) => {
    //Hit the server
    return async (dispatch) => {

        const res = await contractRenewal(ref, sesReqToken);

        console.log("get currencies feedback", res);

        dispatch({
            type: "RENEW_CONTRACT",
            payload: res
        });
    }
};

export const releaseContract = (ref, sesReqToken) => {
    //Hit the server
    return async (dispatch) => {

        const res = await contractRelease(ref, sesReqToken);

        console.log("get currencies feedback", res);

        dispatch({
            type: "RELEASE_CONTRACT",
            payload: res
        });
    }
};

export const moveFundsToFold = (currency, ref, amount) => {
    //Hit the server
    return async (dispatch) => {

        const res = await moveFundsToAWalletFold(currency, ref, amount);

        console.log("get currencies feedback", res);

        dispatch({
            type: "MOVE_FUNDS_TO_FOLD",
            payload: res
        });
    }
};