import axios from 'axios';

const BackendServer = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        "content-type": "application/json"
    }
});

export default {
    BackendServer,
}
