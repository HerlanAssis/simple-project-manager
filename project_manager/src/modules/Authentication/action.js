import * as AuthTypes from './types';

const AuthLogout = ({ key }) => {    
    return {
        type: AuthTypes.SAGA_LOGOUT,
        params: {
            key,
        }
    }
};


export {
    AuthLogout,
}