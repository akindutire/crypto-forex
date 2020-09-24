import { fetchTransactions, fetchAllWithdrawals, approveWithrawalRequest } from './../service/UserSvc';

export const getTransactions = ( currency, sesReqToken ) => {

    //Hit the server
    return async (dispatch) => {

        const res = await fetchTransactions(currency, sesReqToken);

        // console.log("get fetchWalletAddressToPayTo feedback", res);

        dispatch({
            type: "FETCH_TRANSACTIONS",
            payload: res
        });
    }
}; 

//admin
export const getWithdrawals = ( currency, sesReqToken ) => {

    //Hit the server
    return async (dispatch) => {

        const res = await fetchAllWithdrawals(currency, sesReqToken);

        // console.log("get fetchWalletAddressToPayTo feedback", res);

        dispatch({
            type: "FETCH_USERS_WITHDRAWAL_TRANSACTIONS",
            payload: res
        });
    }
}; 

//admin
export const doApproveWithrawalRequest = ( ref ) => {

    //Hit the server
    return async (dispatch) => {

        const res = await approveWithrawalRequest(ref);

        // console.log("get fetchWalletAddressToPayTo feedback", res);

        dispatch({
            type: "APPROVE_USER_WITHDRAWAL_TRANSACTION",
            payload: res
        });
    }
}; 