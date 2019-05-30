import * as TaskManagerTypes from './types';

const DEFAULT_STATE = {
    requestTaskManagerDone: false,
    requestTaskManagerLoading: false,
    createTaskManagerDone: false,
    createTaskManagerLoading: false,
    taskmanager: {},
};

const AuthReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        /**TASK MANAGER REQUEST LOADING */
        case TaskManagerTypes.REQUEST_TASKMANAGER_LOADING:
            return {
                ...state,
                requestTaskManagerDone: false,
                requestTaskManagerLoading: true,
            };
        case TaskManagerTypes.REQUEST_TASKMANAGER_SUCCESS:
            return {
                ...state,
                requestTaskManagerDone: true,
                requestTaskManagerLoading: false,
                taskmanager: action.payload.taskmanager,
            };
        case TaskManagerTypes.REQUEST_TASKMANAGER_ERROR:
            return {
                ...state,
                requestTaskManagerDone: false,
                requestTaskManagerLoading: false,
            };
        /** TASK MANAGER REQUEST LOADING */

        /** CREATE TASK MANAGER */
        case TaskManagerTypes.CREATE_TASKMANAGER_LOADING:
            return {
                ...state,
                createTaskManagerDone: false,
                createTaskManagerLoading: true,
            };
        case TaskManagerTypes.CREATE_TASKMANAGER_SUCCESS:
            return {
                ...state,
                createTaskManagerDone: true,
                createTaskManagerLoading: false,
                taskmanager: action.payload.taskmanager,
            };
        case TaskManagerTypes.CREATE_TASKMANAGER_ERROR:
            return {
                ...state,
                createTaskManagerDone: false,
                createTaskManagerLoading: false,
            };
        /**  CREATE TASK MANAGER */

        default:
            return state;
    }
};

export default AuthReducer;
