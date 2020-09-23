export const shouldNavBeTransparent = (state = false, action) => {

    if(action.type == "DECIDE_NAVBAR_TRANSPAENCY"){
        return action.payload;
    }

    return state;
}

export const shouldFooterBeFixed = (state = false, action) => {

    if(action.type == "DECIDE_FOOTER_FIX"){
        return action.payload;
    }

    return state;
}

export const appEngaged = (state = false, action) => {

    if(action.type == "ENGAGE_APP"){
        return action.payload;
    }

    return state;
}

export const contactUsReceipt = (state = [], action) => {

    if(action.type == "CONTACT_ADMIN"){
        return action.payload;
    }

    return state;
}

export const hashPowerToPurchase = (state = 0.00, action) => {

    if(action.type == "HASH_TO_BE_PURCHASED"){
        return action.payload;
    }

    return state;
}