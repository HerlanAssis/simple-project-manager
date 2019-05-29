import { combineReducers } from 'redux';
import { AuthReducer } from '../modules/Authentication';
import { UserReducer } from '../modules/User';

const rootReducer = combineReducers({
    authentication: AuthReducer,
    user: UserReducer,
});

export default rootReducer;