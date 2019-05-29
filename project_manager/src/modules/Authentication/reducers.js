import * as AuthTypes from './types';

const DEFAULT_STATE = {
    requestTokenDone: false,
    requestTokenLoading: false,

    removeTokenLoading: false,
    removeTokenDone: false,

    requestUserDone: false,
    requestUserLoading: false,
    user: {
        username: 'username',
    },

    requestLimitsDone: false,
    requestLimitsLoading: false,
    limits: {
        core: {
            remaining: 0,
            reset: 0,
            limit: 0,
        }
    },
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

        /**USER REQUEST LOADING */
        case AuthTypes.REQUEST_USER_LOADING:
            return {
                ...state,
                requestUserDone: false,
                requestUserLoading: true,
            };
        case AuthTypes.REQUEST_USER_SUCCESS:
            return {
                ...state,
                requestUserDone: true,
                requestUserLoading: false,
                user: action.payload.user,
            };

        case AuthTypes.REQUEST_USER_ERROR:
            return {
                ...state,
                requestUserDone: false,
                requestUserLoading: false,
            };
        /** USER REQUEST LOADING */

        /**LIMITS REQUEST LOADING */
        case AuthTypes.REQUEST_LIMITS_LOADING:
            return {
                ...state,
                requestLimitsDone: false,
                requestLimitsLoading: true,
            };
        case AuthTypes.REQUEST_LIMITS_SUCCESS:
            return {
                ...state,
                requestLimitsDone: true,
                requestLimitsLoading: false,
                limits: action.payload.limits,
            };

        case AuthTypes.REQUEST_LIMITS_ERROR:
            return {
                ...state,
                requestLimitsDone: false,
                requestLimitsLoading: false,
            };
        /** LIMITS REQUEST LOADING */

        default:
            return state;
    }
};

export default AuthReducer;