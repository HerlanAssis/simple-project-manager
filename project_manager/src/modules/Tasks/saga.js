import { takeEvery, put, call } from 'redux-saga/effects';
import { Api } from '../../services';
import * as TasksTypes from './types';
import { AxiosGraphqlBuilder } from '../../helpers';

const user_selection_set_query = `{id username}`;
const task_selection_set_query = `{id createdAt updatedAt status title description expectedDate responsible${user_selection_set_query}}`;
const vigilantes_selection_set_query = `{id observer${user_selection_set_query}}`
const taskManager_selection_set_query = `{
    id
    invitationCode
    qtdOverdueTasks
    qtdOpenTasks
    qtdTasksCompletedLate
    qtdBlockedTasks
    qtdCompletedTasks
    tasks${task_selection_set_query}
    vigilantes${vigilantes_selection_set_query}
}`;

function* getTaskManager({ params }) {

    console.log("TESTE - getTask", params)

    yield put({
        type: TasksTypes.REQUEST_TASKMANAGER_LOADING,
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
            type: TasksTypes.REQUEST_TASKMANAGER_SUCCESS,
            payload: {
                taskmanager: response.data.data.taskmanager,
            }
        });

    } catch (error) {
        yield put({
            type: TasksTypes.REQUEST_TASKMANAGER_ERROR,
            payload: {}
        });
    }
};

function* getTasks({ params }) {

    yield put({
        type: TasksTypes.REQUEST_TASKS_LOADING,
        payload: {}
    });

    const body = AxiosGraphqlBuilder.query({
        operation_name: 'allTasks',
        variable_definitions: params,
        selection_set_query: task_selection_set_query
    })

    try {
        const response = yield call(Api.BackendServer.post,
            'graphql', body
        );

        yield put({
            type: TasksTypes.REQUEST_TASKS_SUCCESS,
            payload: {
                tasks: response.data.data.allTasks,
            }
        });

    } catch (error) {
        yield put({
            type: TasksTypes.REQUEST_TASKS_ERROR,
            payload: {}
        });
    }
};

// function* createTaskManager({ params }) {

//     yield put({
//         type: TasksTypes.CREATE_TASKMANAGER_LOADING,
//         payload: {}
//     });

//     try {
//         const response = yield call(Api.BackendServer.post, 'graphql', params);
//         yield put({
//             type: TasksTypes.CREATE_TASKMANAGER_SUCCESS,
//             payload: {
//                 taskmanager: response.data.data.taskmanager,
//             }
//         });

//     } catch (error) {
//         yield put({
//             type: TasksTypes.CREATE_TASKMANAGER_ERROR,
//             payload: {}
//         });
//     }
// };

function* createTask({ params }) {

    yield put({
        type: TasksTypes.CREATE_UPDATE_TASK_LOADING,
        payload: {}
    });

    const body = AxiosGraphqlBuilder.mutation({
        operation_name: 'createTask',
        variable_definitions: params,
        selection_set_query: `{ok}`
    })

    try {
        yield call(Api.BackendServer.post,
            'graphql', body
        );

        yield put({
            type: TasksTypes.CREATE_UPDATE_TASK_SUCCESS,
            payload: {}
        });

        // yield call(getTaskManager, { params: { id: params.taskmanagerId } });

    } catch (error) {
        yield put({
            type: TasksTypes.CREATE_TASKMANAGER_ERROR,
            payload: {}
        });
    }
};


function* updateTask({ params }) {

    yield put({
        type: TasksTypes.CREATE_UPDATE_TASK_LOADING,
        payload: {}
    });

    const body = AxiosGraphqlBuilder.mutation({
        operation_name: 'updateTask',
        variable_definitions: params,
        selection_set_query: `{ok}`
    })

    try {
        yield call(Api.BackendServer.post,
            'graphql', body
        );

        yield put({
            type: TasksTypes.CREATE_UPDATE_TASK_SUCCESS,
            payload: {}
        });

        // yield call(getTaskManager, { params: { id: params.taskmanagerId } });

    } catch (error) {
        yield put({
            type: TasksTypes.CREATE_TASKMANAGER_ERROR,
            payload: {}
        });
    }
};

const saga = [
    takeEvery(TasksTypes.SAGA_TASK_MANAGER, getTaskManager),
    takeEvery(TasksTypes.SAGA_TASKS, getTasks),
    takeEvery(TasksTypes.SAGA_CREATE_TASK, createTask),
    takeEvery(TasksTypes.SAGA_UPDATE_TASK, updateTask),
    // takeEvery(TasksTypes.SAGA_CREATE_TASKMANAGER, createTaskManager),
]

export default saga;
