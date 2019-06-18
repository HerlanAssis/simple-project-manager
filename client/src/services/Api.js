import axios from 'axios';
import ErrorResponseHandler from './ErrorResponseHandler';
import {KEYS, URLS} from '../constants';

const BackendServer = axios.create({
    baseURL: URLS.API_BASE_URL,    
    headers: {
        "content-type": "application/json",
        "Authorization": window.localStorage.getItem(KEYS.TOKEN_KEY),
    }
});

BackendServer.interceptors.response.use(null, (error) => ErrorResponseHandler(error));

export default {
    BackendServer,
}
