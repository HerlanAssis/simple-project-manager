import { combineReducers } from 'redux';
import { AuthReducer } from '../modules/Authentication';

const rootReducer = combineReducers({
    authentication: AuthReducer,
});

export default rootReducer;