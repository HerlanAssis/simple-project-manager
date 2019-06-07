import * as TasksTypes from './types';

const DEFAULT_STATE = {
    requestTaskManagerDone: false,
    requestTaskManagerLoading: false,
    // createTaskManagerDone: false,
    // createTaskManagerLoading: false,
    taskmanager: {
        qtdOpenTasks: 0,
        qtdCompletedTasks: 0,
        qtdTasksCompletedLate: 0,
        qtdOverdueTasks: 0,
        qtdBlockedTasks: 0,
        progress: 0,
        tasks: [],
        owner: {},
    },

    requestTasksDone: false,
    requestTasksLoading: false,
    tasks: [],

    requestNotesDone: false,
    requestNotessLoading: false,
    notes: [],

    createTaskLoading: false,
    createTaskSuccess: false,

    createNoteLoading: false,
    createNoteSuccess: false,
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

        /**NOTES REQUEST LOADING */
        case TasksTypes.REQUEST_NOTES_LOADING:
            return {
                ...state,
                requestNotesDone: false,
                requestNotesLoading: true,
            };
        case TasksTypes.REQUEST_NOTES_SUCCESS:
            return {
                ...state,
                requestNotesDone: true,
                requestNotesLoading: false,
                notes: action.payload.notes,
            };
        case TasksTypes.REQUEST_NOTES_ERROR:
            return {
                ...state,
                requestNotesDone: false,
                requestNotesLoading: false,
            };
        /** NOTES REQUEST LOADING */

        /** CREATE TASK MANAGER */
        // case TasksTypes.CREATE_TASKMANAGER_LOADING:
        //     return {
        //         ...state,
        //         createTaskManagerDone: false,
        //         createTaskManagerLoading: true,
        //     };
        // case TasksTypes.CREATE_TASKMANAGER_SUCCESS:
        //     return {
        //         ...state,
        //         createTaskManagerDone: true,
        //         createTaskManagerLoading: false,
        //         taskmanager: action.payload.taskmanager,
        //     };
        // case TasksTypes.CREATE_TASKMANAGER_ERROR:
        //     return {
        //         ...state,
        //         createTaskManagerDone: false,
        //         createTaskManagerLoading: false,
        //     };
        /**  CREATE TASK MANAGER */

        /**TASK REQUEST LOADING */
        case TasksTypes.CREATE_UPDATE_TASK_LOADING:
            return {
                ...state,
                createTaskLoading: true,
                createTaskSuccess: false,
            };
        case TasksTypes.CREATE_UPDATE_TASK_SUCCESS:
            return {
                ...state,
                createTaskLoading: false,
                createTaskSuccess: true,
            };
        case TasksTypes.CREATE_UPDATE_TASK_ERROR:
            return {
                ...state,
                createTaskLoading: false,
                createTaskSuccess: false,
            };
        /** TASK REQUEST LOADING */

        /**NOTE REQUEST LOADING */
        case TasksTypes.CREATE_UPDATE_NOTE_LOADING:
            return {
                ...state,
                createNoteLoading: true,
                createNoteSuccess: false,
            };
        case TasksTypes.CREATE_UPDATE_NOTE_SUCCESS:
            return {
                ...state,
                createNoteLoading: false,
                createNoteSuccess: true,
            };
        case TasksTypes.CREATE_UPDATE_NOTE_ERROR:
            return {
                ...state,
                createNoteLoading: false,
                createNoteSuccess: false,
            };
        /** NOTE REQUEST LOADING */

        default:
            return state;
    }
};

export default TasksReducer;
