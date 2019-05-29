import * as TasksTypes from './types';

const getTaskManager = ({ id, projectId, invitationCode }) => {
    return {
        type: TasksTypes.SAGA_TASK_MANAGER,
        params: {
            id, projectId, invitationCode,
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

export {
    getTaskManager,
    createTaskManager,
}