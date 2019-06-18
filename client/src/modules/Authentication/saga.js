import { takeEvery, put, call } from 'redux-saga/effects';
import { Api } from '../../services';
import * as AuthTypes from './types';

function* getToken({ params }) {

    yield put({
        type: AuthTypes.REQUEST_TOKEN_LOADING,
        payload: {}
    });

    try {
        const token_key = params.token_key;
        delete params['token_key'];

        const response = yield call(Api.BackendServer.post, 'login/social/token_user/google-oauth2/', params);
        const token = `Token ${response.data.token}`
        Api.BackendServer.defaults.headers.Authorization = token;
        window.localStorage.setItem(token_key, token);

        yield put({
            type: AuthTypes.REQUEST_TOKEN_SUCCESS,
            payload: {}
        });

    } catch (error) {
        yield put({
            type: AuthTypes.REQUEST_TOKEN_ERROR,
            payload: {}
        });
    }
};

function* removeToken({ params }) {
    yield put({
        type: AuthTypes.REMOVE_TOKEN_LOADING,
        payload: {}
    });

    try {
        window.localStorage.removeItem(params.token_key);
        window.location.reload();

        yield put({
            type: AuthTypes.REMOVE_TOKEN_SUCCESS,
            payload: {}
        });

    } catch (error) {
        yield put({
            type: AuthTypes.REMOVE_TOKEN_ERROR,
            payload: {}
        });
    }
}

function* getUser({ params }) {

    yield put({
        type: AuthTypes.REQUEST_USER_LOADING,
        payload: {}
    });

    try {
        const response = yield call(Api.BackendServer.get, 'c/user/', params);

        yield put({
            type: AuthTypes.REQUEST_USER_SUCCESS,
            payload: {
                user: response.data.user,
            }
        });

    } catch (error) {
        yield put({
            type: AuthTypes.REQUEST_USER_ERROR,
            payload: {}
        });
    }
};

function* getLimits({ params }) {

    yield put({
        type: AuthTypes.REQUEST_LIMITS_LOADING,
        payload: {}
    });

    try {
        const response = yield call(Api.BackendServer.get, 'pm/limits/', params);        

        yield put({
            type: AuthTypes.REQUEST_LIMITS_SUCCESS,
            payload: {
                limits: response.data,
            }
        });

    } catch (error) {
        yield put({
            type: AuthTypes.REQUEST_LIMITS_ERROR,
            payload: {}
        });
    }
};

const saga = [
    takeEvery(AuthTypes.SAGA_LOGIN, getToken),
    takeEvery(AuthTypes.SAGA_LOGOUT, removeToken),

    takeEvery(AuthTypes.SAGA_USER, getUser),
    takeEvery(AuthTypes.SAGA_LIMITS, getLimits),
]

export default saga;
