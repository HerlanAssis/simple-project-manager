import { AuthSaga } from '../modules/Authentication';

export default function* root() {
    yield [
        ...AuthSaga,
    ];
};