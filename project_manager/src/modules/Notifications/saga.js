import { takeEvery, put, call } from 'redux-saga/effects';
import { Api } from '../../services';
import * as WatcherTypes from './types';
import { AxiosGraphqlBuilder } from '../../helpers';

const watcher_selection_set_query = `{id notification authorizationCode}`;

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
    takeEvery(WatcherTypes.SAGA_UPDATE_WATCHER, updateWatcher),
]

export default saga;
