import { takeEvery, put, call } from 'redux-saga/effects';
import { Api } from '../../services';
import * as WatcherTypes from './types';
import { AxiosGraphqlBuilder } from '../../helpers';

const vigilant_selection_set_query = `{
    id
    createdAt
    projectName
    invitationCode
    qtdOverdueTasks
    qtdOpenTasks
    qtdTasksCompletedLate
    qtdBlockedTasks
    qtdCompletedTasks
    qtdTasks
    progress    
}`;
const watcher_selection_set_query = `{id notification authorizationCode}`;
const history_selection_set_query = `{id message sources createdAt}`
const all_watchers_selection_set_query = `{id notification authorizationCode histories${history_selection_set_query} vigilant${vigilant_selection_set_query}}`;

function* getAllWatchers({ params }) {

    yield put({
        type: WatcherTypes.REQUEST_ALL_WATCHERS_LOADING,
        payload: {}
    });

    const body = AxiosGraphqlBuilder.query({
        operation_name: 'allWatchers',
        variable_definitions: params,
        selection_set_query: all_watchers_selection_set_query
    })

    try {
        const response = yield call(Api.BackendServer.post,
            'graphql', body
        );

        yield put({
            type: WatcherTypes.REQUEST_ALL_WATCHERS_SUCCESS,
            payload: {
                watchers: response.data.data.allWatchers,
            }
        });

    } catch (error) {
        yield put({
            type: WatcherTypes.REQUEST_ALL_WATCHERS_ERROR,
            payload: {}
        });
    }
};

function* getWatcher({ params }) {

    yield put({
        type: WatcherTypes.REQUEST_WATCHER_LOADING,
        payload: {}
    });

    const body = AxiosGraphqlBuilder.query({
        operation_name: 'watcher',
        variable_definitions: params,
        selection_set_query: watcher_selection_set_query
    })

    try {
        const response = yield call(Api.BackendServer.post,
            'graphql', body
        );

        yield put({
            type: WatcherTypes.REQUEST_WATCHER_SUCCESS,
            payload: {
                watcher: response.data.data.watcher,
            }
        });

    } catch (error) {
        yield put({
            type: WatcherTypes.REQUEST_WATCHER_ERROR,
            payload: {}
        });
    }
};


function* createWatcherAsGuest({ params }) {

    yield put({
        type: WatcherTypes.REQUEST_CREATE_WATCHER_LOADING,
        payload: {}
    });

    const body = AxiosGraphqlBuilder.mutation({
        operation_name: 'createWatcherAsGuest',
        variable_definitions: params,
        selection_set_query: '{ok}'
    })

    try {
        const response = yield call(Api.BackendServer.post,
            'graphql', body
        );

        if (response.data.data.createWatcherAsGuest.ok) {
            yield put({
                type: WatcherTypes.REQUEST_CREATE_WATCHER_SUCCESS,
                payload: {}
            });
        } else {
            yield put({
                type: WatcherTypes.REQUEST_CREATE_WATCHER_ERROR,
                payload: {}
            });
        }

    } catch (error) {
        yield put({
            type: WatcherTypes.REQUEST_CREATE_WATCHER_ERROR,
            payload: {}
        });
    }
};

function* updateWatcher({ params }) {

    yield put({
        type: WatcherTypes.REQUEST_WATCHER_LOADING,
        payload: {}
    });

    const body = AxiosGraphqlBuilder.mutation({
        operation_name: 'updateWatcher',
        variable_definitions: params,
        selection_set_query: `{watcher${watcher_selection_set_query}}`
    })

    try {
        const response = yield call(Api.BackendServer.post,
            'graphql', body
        );

        yield put({
            type: WatcherTypes.REQUEST_WATCHER_SUCCESS,
            payload: {
                watcher: response.data.data.updateWatcher.watcher,
            }
        });

    } catch (error) {
        yield put({
            type: WatcherTypes.REQUEST_WATCHER_ERROR,
            payload: {}
        });
    }
};

const saga = [
    takeEvery(WatcherTypes.SAGA_WATCHER, getWatcher),
    takeEvery(WatcherTypes.SAGA_CREATE_WATCHER, createWatcherAsGuest),
    takeEvery(WatcherTypes.SAGA_UPDATE_WATCHER, updateWatcher),
    takeEvery(WatcherTypes.SAGA_ALL_WATCHERS, getAllWatchers),
]

export default saga;
