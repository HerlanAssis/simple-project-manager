import { takeEvery, put, call } from 'redux-saga/effects';
import { Api } from '../../services';
import * as TasksTypes from './types';
import { AxiosGraphqlBuilder } from '../../helpers';

const user_selection_set_query = `{id username}`;
const task_selection_set_query = `{id createdAt updatedAt status title description expectedDate conclusionDate expiresToday responsible${user_selection_set_query}}`;
const vigilantes_selection_set_query = `{id observer${user_selection_set_query}}`
const notes_selection_set_query = `{id createdAt description owner${user_selection_set_query}}`;
const taskManager_selection_set_query = `{
    id
    projectName
    invitationCode
    qtdOverdueTasks
    qtdOpenTasks
    qtdTasksCompletedLate
    qtdBlockedTasks
    qtdCompletedTasks
    qtdTasks
    progress
    tasks${task_selection_set_query}
    vigilantes${vigilantes_selection_set_query}
    owner${user_selection_set_query}
}`;

const taskManagers_selection_set_query = `{
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

function* getAllTaskManagers({ params }) {

    yield put({
        type: TasksTypes.REQUEST_TASKMANAGERS_LOADING,
        payload: {}
    });

    const body = AxiosGraphqlBuilder.query({
        operation_name: 'allTaskmanagers',
        variable_definitions: params,
        selection_set_query: taskManagers_selection_set_query
    })

    try {
        const response = yield call(Api.BackendServer.post,
            'graphql', body
        );

        yield put({
            type: TasksTypes.REQUEST_TASKMANAGERS_SUCCESS,
            payload: {
                taskmanagers: response.data.data.allTaskmanagers,
            }
        });

    } catch (error) {
        yield put({
            type: TasksTypes.REQUEST_TASKMANAGERS_ERROR,
            payload: {}
        });
    }
};

function* getTaskManager({ params }) {

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

function* getAllTasks({ params }) {

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

function* getNotes({ params }) {

    yield put({
        type: TasksTypes.REQUEST_NOTES_LOADING,
        payload: {}
    });

    const body = AxiosGraphqlBuilder.query({
        operation_name: 'allNotes',
        variable_definitions: params,
        selection_set_query: notes_selection_set_query
    })

    try {
        const response = yield call(Api.BackendServer.post,
            'graphql', body
        );

        yield put({
            type: TasksTypes.REQUEST_NOTES_SUCCESS,
            payload: {
                notes: response.data.data.allNotes,
            }
        });

    } catch (error) {
        yield put({
            type: TasksTypes.REQUEST_NOTES_ERROR,
            payload: {}
        });
    }
};

function* createNote({ params }) {

    yield put({
        type: TasksTypes.CREATE_UPDATE_NOTE_LOADING,
        payload: {}
    });

    const body = AxiosGraphqlBuilder.mutation({
        operation_name: 'createNote',
        variable_definitions: params,
        selection_set_query: `{ok}`
    })

    try {
        yield call(Api.BackendServer.post,
            'graphql', body
        );

        yield put({
            type: TasksTypes.CREATE_UPDATE_NOTE_SUCCESS,
            payload: {}
        });

    } catch (error) {
        yield put({
            type: TasksTypes.CREATE_UPDATE_NOTE_ERROR,
            payload: {}
        });
    }
};

const saga = [
    takeEvery(TasksTypes.SAGA_ALL_TASK_MANAGERS, getAllTaskManagers),
    takeEvery(TasksTypes.SAGA_TASK_MANAGER, getTaskManager),
    takeEvery(TasksTypes.SAGA_TASKS, getAllTasks),
    takeEvery(TasksTypes.SAGA_CREATE_TASK, createTask),
    takeEvery(TasksTypes.SAGA_UPDATE_TASK, updateTask),
    takeEvery(TasksTypes.SAGA_NOTES, getNotes),
    takeEvery(TasksTypes.SAGA_CREATE_NOTE, createNote),
    // takeEvery(TasksTypes.SAGA_CREATE_TASKMANAGER, createTaskManager),

    // condições especiais
    takeEvery(TasksTypes.CREATE_UPDATE_TASK_SUCCESS, getAllTasks),
]

export default saga;
