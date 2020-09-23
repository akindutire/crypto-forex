import { withdrawFund } from './../service/UserSvc';

export const withdraw = ( payload ) => {

    //Hit the server
    return async (dispatch) => {

        const res = await withdrawFund(payload);

        console.log("get fetchWalletAddressToPayTo feedback", res);

        dispatch({
            type: "WITHDRAW",
            payload: res
        });
    }
}; 

//not in use
export const fetchWalletAddressToWithdrawTo = ( ) => {

        
      //Hit the server
      return async (dispatch) => {

        // const res = await unfulfilledPaymentExpectation(currency, sesReqToken);

        // console.log("get fetchWalletAddressToPayTo feedback", res);

        // dispatch({
        //     type: "FETCH_WALLET_ADDRESS_WITHDRAW_TO",
        //     payload: res
        // });
    }
};