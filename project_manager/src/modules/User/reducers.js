import * as UserTypes from './types';

const DEFAULT_STATE = {
    requestUserDone: false,
    requestUserLoading: false,
    user: {},

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

const UserReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        /**USER REQUEST LOADING */
        case UserTypes.REQUEST_USER_LOADING:
            return {
                ...state,
                requestUserDone: false,
                requestUserLoading: true,
            };
        case UserTypes.REQUEST_USER_SUCCESS:
            return {
                ...state,
                requestUserDone: true,
                requestUserLoading: false,
                user: action.payload.user,
            };

        case UserTypes.REQUEST_USER_ERROR:
            return {
                ...state,
                requestUserDone: false,
                requestUserLoading: false,
            };
        /** USER REQUEST LOADING */

        /**LIMITS REQUEST LOADING */
        case UserTypes.REQUEST_LIMITS_LOADING:
            return {
                ...state,
                requestLimitsDone: false,
                requestLimitsLoading: true,
            };
        case UserTypes.REQUEST_LIMITS_SUCCESS:
            return {
                ...state,
                requestLimitsDone: true,
                requestLimitsLoading: false,
                limits: action.payload.limits,
            };

        case UserTypes.REQUEST_LIMITS_ERROR:
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

export default UserReducer;