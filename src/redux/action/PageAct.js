import { contactCryptFx } from './../service/AuthSvc';

export const navShouldBeTransapent = ( payload = true) => {

    return {
        type: "DECIDE_NAVBAR_TRANSPAENCY",
        payload
    };
} ; 


export const footerShouldBeFixed = ( payload = false) => {

    return {
        type: "DECIDE_FOOTER_FIX",
        payload
    };
} ; 

export const engageApp = ( payload = false) => {

    return {
        type: "ENGAGE_APP",
        payload
    };
} ; 

export const contactAdmin = ( payload) => {

     //Hit the server
     return async (dispatch) => {

        const res = await contactCryptFx(payload);

        console.log("book forgot pwd session feedback", res);

        dispatch({
                type: "CONTACT_ADMIN",
                payload: res
            });
    }
   
} ;

export const setHashPowerToPurchase = ( payload ) => {

    return {
        type: "HASH_TO_BE_PURCHASED",
        payload
    };
} ; 