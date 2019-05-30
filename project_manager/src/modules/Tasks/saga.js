import { takeEvery, put, call } from 'redux-saga/effects';
import { Api } from '../../services';
import * as TaskManagerTypes from './types';
import { AxiosGraphqlBuilder } from '../../helpers';

const user_selection_set_query = `{id username}`;
const task_selection_set_query = `{id createdAt updatedAt status title description expectedDate}`;
const taskManager_selection_set_query = `{id tasks${task_selection_set_query}}`;

function* getTaskManager({ params }) {

    yield put({
        type: TaskManagerTypes.REQUEST_TASKMANAGER_LOADING,
        payload: {}
    });

    const body = AxiosGraphqlBuilder.query({
        operation_name: 'taskmanager',
        variable_definitions: params,
        selection_set_query: taskManager_selection_set_query
    })

    try {
        const response = yield call(Api.BackendServer.post,
            'graphql', body
        );

        yield put({
            type: TaskManagerTypes.REQUEST_TASKMANAGER_SUCCESS,
            payload: {
                taskManager: response.data.data,
            }
        });

    } catch (error) {
        yield put({
            type: TaskManagerTypes.REQUEST_TASKMANAGER_ERROR,
            payload: {}
        });
    }
};

function* createTaskManager({ params }) {

    yield put({
        type: TaskManagerTypes.CREATE_TASKMANAGER_LOADING,
        payload: {}
    });

    try {
        const response = yield call(Api.BackendServer.post, 'graphql', params);
        yield put({
            type: TaskManagerTypes.CREATE_TASKMANAGER_SUCCESS,
            payload: {
                taskManager: response.data,
            }
        });

    } catch (error) {
        yield put({
            type: TaskManagerTypes.CREATE_TASKMANAGER_ERROR,
            payload: {}
        });
    }
};

const saga = [
    takeEvery(TaskManagerTypes.SAGA_TASK_MANAGER, getTaskManager),
    takeEvery(TaskManagerTypes.SAGA_CREATE_TASKMANAGER, createTaskManager),
]

export default saga;
