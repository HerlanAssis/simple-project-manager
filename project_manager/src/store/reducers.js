import { combineReducers } from 'redux';
import { AuthReducer } from '../modules/Authentication';
import { TasksReducer } from '../modules/Tasks';
import { NotificationsReducer } from '../modules/Notifications';

const rootReducer = combineReducers({
    authentication: AuthReducer,
    tasks: TasksReducer,
    notifications: NotificationsReducer,
});

export default rootReducer;