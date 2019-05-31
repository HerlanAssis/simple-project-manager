import * as TasksTypes from './types';

const getWacher = ({ id, projectId, authorizationCode }) => {
    return {
        type: TasksTypes.SAGA_WATCHER,
        params: {
            id, projectId: projectId, authorizationCode
        }
    }
};

export {
    getWacher,
}