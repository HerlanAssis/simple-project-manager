import axios from 'axios';
import {KEYS} from '../constants';

const BackendServer = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        "content-type": "application/json",
        "Authorization": window.localStorage.getItem(KEYS.TOKEN_KEY),
    }
});

export default {
    BackendServer,
}
