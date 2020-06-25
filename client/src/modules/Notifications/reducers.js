import * as NotificationsTypes from './types';

const DEFAULT_STATE = {
    requestWatcherDone: false,
    requestWatcherLoading: false,
    watcher: {},

    requestAllWatchersDone: false,
    requestAllWatchersLoading: false,
    watchers: [],

    requestCreateWatcherDone: false,
    requestCreateWatcherLoading: false,
};

const NotificationsReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        /** WATCHERS REQUEST LOADING */
        case NotificationsTypes.REQUEST_ALL_WATCHERS_LOADING:
            return {
                ...state,
                requestAllWatchersDone: false,
                requestAllWatchersLoading: true,
            };
        case NotificationsTypes.REQUEST_ALL_WATCHERS_SUCCESS:
            return {
                ...state,
                requestAllWatchersDone: true,
                requestAllWatchersLoading: false,
                watchers: action.payload.watchers,
            };
        case NotificationsTypes.REQUEST_ALL_WATCHERS_ERROR:
            return {
                ...state,
                requestAllWatchersDone: false,
                requestAllWatchersLoading: false,
            };
        /**  WATCHERS REQUEST LOADING */

        /**WATCHER REQUEST LOADING */
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
        /** WATCHER REQUEST LOADING */

        /**WATCHER REQUEST LOADING */
        case NotificationsTypes.REQUEST_CREATE_WATCHER_LOADING:
            return {
                ...state,
                requestCreateWatcherDone: false,
                requestCreateWatcherLoading: true,
            };
        case NotificationsTypes.REQUEST_CREATE_WATCHER_SUCCESS:
            return {
                ...state,
                requestCreateWatcherDone: true,
                requestCreateWatcherLoading: false,
            };
        case NotificationsTypes.REQUEST_CREATE_WATCHER_ERROR:
            return {
                ...state,
                requestCreateWatcherDone: false,
                requestCreateWatcherLoading: false,
            };
        /** WATCHER REQUEST LOADING */

        default:
            return state;
    }
};

export default NotificationsReducer;
