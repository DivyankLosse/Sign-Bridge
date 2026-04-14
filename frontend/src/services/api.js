import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

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
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
