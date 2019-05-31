import * as TasksTypes from './types';

const DEFAULT_STATE = {
    requestTaskManagerDone: false,
    requestTaskManagerLoading: false,
    createTaskManagerDone: false,
    createTaskManagerLoading: false,
    taskmanager: {},

    requestTasksDone: false,
    requestTasksLoading: false,
    tasks: [],
};

const TasksReducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        /**TASK MANAGER REQUEST LOADING */
        case TasksTypes.REQUEST_TASKMANAGER_LOADING:
            return {
                ...state,
                requestTaskManagerDone: false,
                requestTaskManagerLoading: true,
            };
        case TasksTypes.REQUEST_TASKMANAGER_SUCCESS:
            return {
                ...state,
                requestTaskManagerDone: true,
                requestTaskManagerLoading: false,
                taskmanager: action.payload.taskmanager,
            };
        case TasksTypes.REQUEST_TASKMANAGER_ERROR:
            return {
                ...state,
                requestTaskManagerDone: false,
                requestTaskManagerLoading: false,
            };
        /** TASK MANAGER REQUEST LOADING */

        /**TASK REQUEST LOADING */
        case TasksTypes.REQUEST_TASKS_LOADING:
            return {
                ...state,
                requestTasksDone: false,
                requestTasksLoading: true,
            };
        case TasksTypes.REQUEST_TASKS_SUCCESS:
            return {
                ...state,
                requestTasksDone: true,
                requestTasksLoading: false,
                tasks: action.payload.tasks,
            };
        case TasksTypes.REQUEST_TASKS_ERROR:
            return {
                ...state,
                requestTasksDone: false,
                requestTasksLoading: false,
            };
        /** TASK REQUEST LOADING */

        /** CREATE TASK MANAGER */
        case TasksTypes.CREATE_TASKMANAGER_LOADING:
            return {
                ...state,
                createTaskManagerDone: false,
                createTaskManagerLoading: true,
            };
        case TasksTypes.CREATE_TASKMANAGER_SUCCESS:
            return {
                ...state,
                createTaskManagerDone: true,
                createTaskManagerLoading: false,
                taskmanager: action.payload.taskmanager,
            };
        case TasksTypes.CREATE_TASKMANAGER_ERROR:
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

export default TasksReducer;
