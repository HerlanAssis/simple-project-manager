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

export {
    getTaskManager,
    createTaskManager,
    getTasks,
}