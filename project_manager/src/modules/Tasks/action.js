import * as TasksTypes from './types';

const getTaskManager = ({ id, projectId, invitationCode, owner }) => {
    return {
        type: TasksTypes.SAGA_TASK_MANAGER,
        params: {
            id, projectId, invitationCode, owner
        }
    }
};

const createTaskManager = ({ projectName, projectId }) => {
    return {
        type: TasksTypes.SAGA_CREATE_TASKMANAGER,
        params: {
            projectId, projectName,
        }
    }
};

const getTasks = () => {
    return {
        type: TasksTypes.SAGA_TASKS,
        params: {}
    }
};

const createTask = ({ responsibleId, taskmanagerId, input }) => {
    return {
        type: TasksTypes.SAGA_CREATE_TASK,
        params: {
            responsibleId, taskmanagerId, input
        }
    }
}

const updateTask = ({ id, responsibleId, input }) => {
    return {
        type: TasksTypes.SAGA_UPDATE_TASK,
        params: {
            id, responsibleId, input
        }
    }
}


export {
    getTaskManager,
    createTaskManager,
    getTasks,
    createTask,
    updateTask,
}