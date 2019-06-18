import * as NotifictionsTypes from './types';

const getAllWachers = () => {
    return {
        type: NotifictionsTypes.SAGA_ALL_WATCHERS,
        params: {},
    }
};

const getWacher = ({ id, projectId, authorizationCode }) => {
    return {
        type: NotifictionsTypes.SAGA_WATCHER,
        params: {
            id, projectId: projectId, authorizationCode
        }
    }
};

const updateWatcher = ({ id, notification }) => {
    return {
        type: NotifictionsTypes.SAGA_UPDATE_WATCHER,
        params: {
            id,
            input: { notification }
        }
    }
};

export {
    getWacher,
    updateWatcher,
    getAllWachers,
}