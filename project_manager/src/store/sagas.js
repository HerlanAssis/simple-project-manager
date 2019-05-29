import { AuthSaga } from '../modules/Authentication';
import { UserSaga } from '../modules/User';

export default function* root() {
    yield [
        ...AuthSaga,
        ...UserSaga,
    ];
};
