import { loginUser, registerUser, bookAForgotPwdSession, resetPwd, fetchCurProfile, setUp2FA, collapse2FA, mfaForUserVerification } from './../service/AuthSvc';

export const authenticate = (payload) => {
    // payload:{username:"",password:""}
    return async (dispatch) => {

        const res = await loginUser(payload);

        // console.log("signin feedback", res);

        dispatch({
                type: "AUTHENTICATE_USER",
                payload: res
            });
    }
} ;

export const authorize = (token, email, authority) => {
    
        const data = {t: token, e: email, a: authority}
        localStorage.setItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425", JSON.stringify(data));
     
        return {
            type: "RAISE_AUTH_GREEN_FLAG",
            payload: true
        };
    
} ;

export const unAuthorize = () => {
    return async (dispatch) => {

        if(localStorage.getItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425") != null){
            localStorage.removeItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425");
        }
    
        dispatch({
                type: "RAISE_AUTH_GREEN_FLAG",
                payload: false
            });
    }
 
} ;

export const bookForgotPasswordSession = (email, sessToken) => {
    
    //Hit the server
    return async (dispatch) => {

        const res = await bookAForgotPwdSession(email, sessToken);

        // console.log("book forgot pwd session feedback", res);

        dispatch({
                type: "BOOK_A_FORGOT_PASSWORD_SESSION",
                payload: res
            });
    }
} ;


export const resetPassword = (payload) => {
    
    //payload:{resetToken:"", password:"", confirm_password:""}
    //Hit the server
    return async (dispatch) => {

        const res = await resetPwd(payload);

        // console.log("reset pwd session feedback", res);

        dispatch({
                type: "RESET_PASSWORD",
                payload: res
            });
    }
    
} ;


export const register = (payload) => {
    
    //payload:{name:"", email:"", password:"", confirmPassword:""}
     return async (dispatch) => {

        const res = await registerUser(payload);

        // console.log("signup feedback", res);

        dispatch({
                type: "REGISTER_USER",
                payload: res
            });
    }
    
} ;


export const getProfile = (sessToken) => {
    
    //Hit the server
    return async (dispatch) => {

        const res = await fetchCurProfile(sessToken);

        // console.log("fetch profile feedback", res);

        dispatch({
                type: "GET_CURRENT_USER_PROFILE",
                payload: res
            });
    }
} ;


export const enable2FA = (sessToken) => {
    
    //Hit the server
    return async (dispatch) => {

        const res = await setUp2FA(sessToken);

        // console.log("fetch profile feedback", res);

        dispatch({
                type: "ENABLE_2FA",
                payload: res
            });
    }
} ;

export const disable2FA = (sessToken) => {
    
    //Hit the server
    return async (dispatch) => {

        const res = await collapse2FA(sessToken);

        // console.log("fetch profile feedback", res);

        dispatch({
                type: "COLLAPSE_2FA",
                payload: res
            });
    }
} ;

export const mfaVerification = (payload) => {
    
    //Hit the server
    return async (dispatch) => {

        const res = await mfaForUserVerification(payload);

        // console.log("book forgot pwd session feedback", res);

        dispatch({
                type: "MFA_VERIFICATION",
                payload: res
            });
    }
} ;