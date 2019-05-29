import { combineReducers } from 'redux';
import { AuthReducer } from '../modules/Authentication';
import { TasksReducer } from '../modules/Tasks';

const rootReducer = combineReducers({
    authentication: AuthReducer,
    tasks: TasksReducer,
});

export default rootReducer;