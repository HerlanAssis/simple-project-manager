import * as TasksTypes from './types';

const getWacher = ({ id, projectId, authorizationCode }) => {
    return {
        type: TasksTypes.SAGA_WATCHER,
        params: {
            id, projectId: projectId, authorizationCode
        }
    }
};

const updateWatcher = ({ id, notification }) => {
    return {
        type: TasksTypes.SAGA_UPDATE_WATCHER,
        params: {
            id,
            input: { notification }
        }
    }
};

export {
    getWacher, updateWatcher
}