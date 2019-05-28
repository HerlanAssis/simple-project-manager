import * as AuthTypes from './types';

const AuthLogin = ({ code, client_id, redirect_uri, token_key }) => {
    return {
        type: AuthTypes.SAGA_LOGIN,
        params: {
            code, client_id, redirect_uri, token_key
        }
    }
};

const AuthLogout = ({ token_key }) => {
    return {
        type: AuthTypes.SAGA_LOGOUT,
        params: {
            token_key
        }
    }
};

export {
    AuthLogin,
    AuthLogout,
}