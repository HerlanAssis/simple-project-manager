import { AuthSaga } from '../modules/Authentication';
import { TasksSaga } from '../modules/Tasks';
import { NotificationsSaga } from '../modules/Notifications';
import { FeedbackSaga } from '../modules/Feedback';

export default function* root() {
    yield [
        ...AuthSaga,
        ...TasksSaga,
        ...NotificationsSaga,
        ...FeedbackSaga,
    ];
};
