import { AuthSaga } from '../modules/Authentication';
import { TasksSaga } from '../modules/Tasks';

export default function* root() {
    yield [
        ...AuthSaga,
        ...TasksSaga
    ];
};
