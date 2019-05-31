import { AuthSaga } from '../modules/Authentication';
import { TasksSaga } from '../modules/Tasks';
import { NotificationsSaga } from '../modules/Notifications';

export default function* root() {
    yield [
        ...AuthSaga,
        ...TasksSaga,
        ...NotificationsSaga
    ];
};
