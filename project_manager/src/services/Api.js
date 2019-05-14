import axios from 'axios';
import {KEYS, URLS} from '../constants';

const BackendServer = axios.create({
    baseURL: URLS.API_BASE_URL,    
    headers: {
        "content-type": "application/json",
        "Authorization": window.localStorage.getItem(KEYS.TOKEN_KEY),
    }
});

export default {
    BackendServer,
}
