import * as AuthTypes from './types';

const authLogin = ({ code, client_id, redirect_uri, token_key }) => {
    return {
        type: AuthTypes.SAGA_LOGIN,
        params: {
            code, client_id, redirect_uri, token_key
        }
    }
};

const authLogout = ({ token_key }) => {
    return {
        type: AuthTypes.SAGA_LOGOUT,
        params: {
            token_key
        }
    }
};

export {
    authLogin,
    authLogout,
}