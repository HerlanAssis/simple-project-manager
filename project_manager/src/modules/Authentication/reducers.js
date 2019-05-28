import * as AuthTypes from './types';

const DEFAULT_STATE = {
    requestTokenDone: false,
    requestTokenLoading: false,
    
    removeTokenLoading: false,
    removeTokenDone: false,
};

const AuthReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        /**Token REQUEST LOADING */
        case AuthTypes.REQUEST_TOKEN_LOADING:
            return {
                ...state,
                requestTokenDone: false,
                requestTokenLoading: true,
            };
        case AuthTypes.REQUEST_TOKEN_SUCCESS:
            return {
                ...state,
                requestTokenDone: true,
                requestTokenLoading: false,
            };
        case AuthTypes.REQUEST_TOKEN_ERROR:
            return {
                ...state,
                requestTokenDone: false,
                requestTokenLoading: false,
            };
        /** Token REQUEST LOADING */

        /** REMOVE TOKEN LOADING */
        case AuthTypes.REMOVE_TOKEN_SUCCESS:
            return DEFAULT_STATE;

        case AuthTypes.REMOVE_TOKEN_ERROR:
            return {
                ...state,
                removeTokenLoading: false,
            };
        /** REMOVE TOKEN LOADING */

        default:
            return state;
    }
};

export default AuthReducer;