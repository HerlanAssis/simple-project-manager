import { takeEvery, put, call } from 'redux-saga/effects';
import { Api } from '../../services';
import * as AuthTypes from './types';

function* removeToken({ params }) {
    console.log("AQUI")
    
    yield put({
        type: AuthTypes.REMOVE_TOKEN_LOADING,
        payload: {}
    });

    try {
        const response = yield call(Api.BackendServer.post, 'auth/revoke-token/', params);
        window.localStorage.removeItem(params.key);

        console.log(response)
        
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

const saga = [    
    takeEvery(AuthTypes.SAGA_LOGOUT, removeToken),
]

export default saga;
