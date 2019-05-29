import { takeEvery, put, call } from 'redux-saga/effects';
import { Api } from '../../services';
import * as UserTypes from './types';

function* getUser({ params }) {

    yield put({
        type: UserTypes.REQUEST_USER_LOADING,
        payload: {}
    });

    try {
        const response = yield call(Api.BackendServer.get, 'pm/user/', params);

        console.log(response);

        yield put({
            type: UserTypes.REQUEST_USER_SUCCESS,
            payload: {
                user: response.data,
            }
        });

    } catch (error) {
        yield put({
            type: UserTypes.REQUEST_USER_ERROR,
            payload: {}
        });
    }
};

function* getLimits({ params }) {

    yield put({
        type: UserTypes.REQUEST_LIMITS_LOADING,
        payload: {}
    });

    try {
        const response = yield call(Api.BackendServer.get, 'pm/limits/', params);        

        yield put({
            type: UserTypes.REQUEST_LIMITS_SUCCESS,
            payload: {
                limits: response.data,
            }
        });

    } catch (error) {
        yield put({
            type: UserTypes.REQUEST_LIMITS_ERROR,
            payload: {}
        });
    }
};

const saga = [
    takeEvery(UserTypes.SAGA_USER, getUser),
    takeEvery(UserTypes.SAGA_LIMITS, getLimits),
]

export default saga;
