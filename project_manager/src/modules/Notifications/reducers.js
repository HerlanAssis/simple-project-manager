import * as NotificationsTypes from './types';

const DEFAULT_STATE = {
    requestWatcherDone: false,
    requestWatcherLoading: false,
    watcher: {},
};

const NotificationsReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        /**TASK MANAGER REQUEST LOADING */
        case NotificationsTypes.REQUEST_WATCHER_LOADING:
            return {
                ...state,
                requestWatcherDone: false,
                requestWatcherLoading: true,
            };
        case NotificationsTypes.REQUEST_WATCHER_SUCCESS:
            return {
                ...state,
                requestWatcherDone: true,
                requestWatcherLoading: false,
                watcher: action.payload.watcher,
            };
        case NotificationsTypes.REQUEST_WATCHER_ERROR:
            return {
                ...state,
                requestWatcherDone: false,
                requestWatcherLoading: false,
            };
        /** TASK MANAGER REQUEST LOADING */

        default:
            return state;
    }
};

export default NotificationsReducer;
