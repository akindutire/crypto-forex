import {CryptoFxApi, AuthorizedCryptoFxApi, getToken, getEmail} from './FxApi';

export const fetchCurProfile = (sesReqToken) => {
    const email = getEmail();
    return AuthorizedCryptoFxApi.get("/user/profile",{
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        params:{
            search: email
        },
        cancelToken: sesReqToken
    });
}

export const setUp2FA = (sesReqToken) => {
    return AuthorizedCryptoFxApi.get("/user/enable/mfa",{
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        cancelToken: sesReqToken
    });
}

export const collapse2FA = (sesReqToken) => {
    return AuthorizedCryptoFxApi.get("/user/disable/mfa",{
        headers:{
            'Authorization': `Bearer ${getToken()}`
        },
        cancelToken: sesReqToken
    });
}

export const loginUser = (body) => {

    return CryptoFxApi.post("/auth/signin", JSON.stringify(body),{
        headers: {
            'content-type': 'application/json'
        }
    });
    
}

export const mfaForUserVerification = (body) => {

    return CryptoFxApi.post("/auth/verify/mfa", JSON.stringify(body),{
        headers: {
            'content-type': 'application/json'
        }
    });
}

export const registerUser = (body) => {
    return CryptoFxApi.post("/onboard/signup", JSON.stringify(body),{
        headers: {
            'content-type': 'application/json'
        }
    });
    
}

export const bookAForgotPwdSession = (email, sesReqToken) => {
    return CryptoFxApi.get("/password/acquire/verification/token/"+email,{
        headers: {
            'content-type': 'application/json'
        },
        params:{
            time: Date.now()
        },
        cancelToken: sesReqToken
    });
    
}

export const resetPwd = (body) => {
    return CryptoFxApi.put("/password/reset", JSON.stringify(body),{
        headers: {
            'content-type': 'application/json'
        }
    });
    
}

export const contactCryptFx = (body) => {
    return CryptoFxApi.post("/onboard/contact/admin", JSON.stringify(body),{
        headers: {
            'content-type': 'application/json'
        }
    });
    
}