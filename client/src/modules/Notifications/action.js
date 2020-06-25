import * as NotifictionsTypes from './types';

const getAllWatchers = () => {
    return {
        type: NotifictionsTypes.SAGA_ALL_WATCHERS,
        params: {},
    }
};

const getWacher = ({ id, projectId, authorizationCode }) => {
    return {
        type: NotifictionsTypes.SAGA_WATCHER,
        params: {
            id: Number(id), projectId: projectId, authorizationCode
        }
    }
};

const createWacherAsGuest = ({ invitationCode }) => {
    return {
        type: NotifictionsTypes.SAGA_CREATE_WATCHER,
        params: {
            invitationCode
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
    getAllWatchers,
    createWacherAsGuest,
}