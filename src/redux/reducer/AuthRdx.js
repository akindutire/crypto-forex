export const authenticationReceipt = (state = [], action) => {

    if(action.type == "AUTHENTICATE_USER"){
        return action.payload;
    }

    return state;
}

export const authorized = (state = true, action) => {

    if(action.type == "RAISE_AUTH_GREEN_FLAG"){
        return action.payload;
    }

    if(localStorage.getItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425") == null){
       return false;
    }

    return state;
}


export const bookedSessionForForgotPassword = (state = [], action) => {

    if(action.type == "BOOK_A_FORGOT_PASSWORD_SESSION"){
        return action.payload;
    }

    return state;
}

export const resetPasswordPasswordReceipt = (state = [], action) => {

    if(action.type == "RESET_PASSWORD"){
        return action.payload;
    }

    return state;
}

export const registrationReceipt = (state = [], action) => {

    if(action.type == "REGISTER_USER"){
        return action.payload;
    }

    return state;
}


export const currentUserProfile = (state = [], action) => {

    if(action.type == "GET_CURRENT_USER_PROFILE"){
        return action.payload;
    }

    return state;  
}

export const enable2faReceipt = (state = [], action) => {

    if(action.type == "ENABLE_2FA"){
        return action.payload;
    }

    return state;  
}

export const disable2faReceipt = (state = [], action) => {

    if(action.type == "COLLAPSE_2FA"){
        return action.payload;
    }

    return state;  
}

export const mfaVerificationReceipt = (state = [], action) => {

    if(action.type == "MFA_VERIFICATION"){
        return action.payload;
    }

    return state;  
}