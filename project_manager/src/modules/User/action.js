import * as UserTypes from './types';

const getUser = () => {
    return {
        type: UserTypes.SAGA_USER,
    }
};

const getLimits = () => {
    return {
        type: UserTypes.SAGA_LIMITS,
    }
};

export {
    getUser,
    getLimits,
}