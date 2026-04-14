import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const PUBLIC_AUTH_PATHS = new Set(['/auth/login', '/auth/signup']);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const requestPath = config.url || '';
        const shouldAttachAuth = token && !PUBLIC_AUTH_PATHS.has(requestPath);

        if (shouldAttachAuth) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (config.headers?.Authorization) {
            delete config.headers.Authorization;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401) {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }

        const detail = error.response?.data?.detail;
        error.userMessage =
            typeof detail === 'string'
                ? detail
                : 'Something went wrong while talking to the server.';

        return Promise.reject(error);
    }
);

export default api;
