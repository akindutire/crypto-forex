import { probePayment, initiateContractViaPaymentSetup, unfulfilledPaymentExpectation } from './../service/ContractSvc';

export const probeUserPayment = ( currency, expectedCryptoVal ) => {

    //Hit the server
    return async (dispatch) => {

        const res = await probePayment(currency, expectedCryptoVal);

        // console.log("get fetchWalletAddressToPayTo feedback", res);

        dispatch({
                type: "PROBE_PAYMENT",
                payload: res
        });
    }
}; 

export const fetchWalletAddressToPayTo = ( currency, expectedCryptoVal ) => {

    //Hit the server
    return async (dispatch) => {

        const res = await initiateContractViaPaymentSetup(currency, expectedCryptoVal);

        // console.log("get fetchWalletAddressToPayTo feedback", res);

        dispatch({
                type: "FETCH_WALLET_ADDRESS_TO_PAY_TO",
                payload: res
        });
    }
};


export const fetchUnfulfilledPaymentExpectation = ( currency, sesReqToken ) => {

    //Hit the server
    return async (dispatch) => {

        const res = await unfulfilledPaymentExpectation(currency, sesReqToken);

        // console.log("get fetchWalletAddressToPayTo feedback", res);

        dispatch({
                type: "FETCH_UNFULFILLED_PAYMENT_EXPECTATION",
                payload: res
        });
    }
};
