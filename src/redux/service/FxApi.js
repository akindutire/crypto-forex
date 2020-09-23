import axios from 'axios';
import { getDomain } from './Env';

const domain = getDomain();

export const CryptoFxApi = axios.create({

    baseURL: domain,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': "*"
    },
    validateStatus: function (status) {
        // return true;
        return status < 600;
    }
});

export const getToken = () => {
    let data = localStorage.getItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425");
    if(data != null){
        const d = JSON.parse(data);
        return d.t;
    }
    return "";
}

export const getEmail = () => {
    let data = localStorage.getItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425");
    if(data != null){
        const d = JSON.parse(data);
        return d.e;
    }
    return "";
}

export const getAuthority = () => {
    let data = localStorage.getItem("$_ORG+=.*653-CR653-CRY15_FX_WJ1193339425_FX_WJT_KOTNE.98193339425");
    if(data != null){
        const d = JSON.parse(data);
        return d.a;
    }
    return "";
}

export const AuthorizedCryptoFxApi = axios.create({

    baseURL: domain,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': "*"
    },
    validateStatus: function (status) {
        return true;
        // return status < 600;
    }
});
