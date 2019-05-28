import * as AuthTypes from './types';

const DEFAULT_STATE = {
    removeTokenLoading: false,
    removeTokenDone: false,
};

const AuthReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        /**Token REQUEST LOADING */
        // case AuthTypes.TOKEN_REQUEST_LOADING:
        //     return {
        //         ...state,
        //         tokenRequestDone: false,
        //         tokenRequestLoading: true,
        //     };
        // case AuthTypes.TOKEN_REQUEST_SUCCESS:
        //     return {
        //         ...state,
        //         tokenRequestDone: true,
        //         tokenRequestLoading: false,
        //     };
        // case AuthTypes.TOKEN_REQUEST_ERROR:
        //     return {
        //         ...state,
        //         tokenRequestDone: false,
        //         tokenRequestLoading: false,
        //     };
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