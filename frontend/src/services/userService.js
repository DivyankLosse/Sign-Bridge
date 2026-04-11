import api from './api';

export const userService = {
    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await api.put('/user/profile', data);
        return response.data;
    },
    getPreferences: async () => {
        const response = await api.get('/user/preferences');
        return response.data;
    },
    updatePreferences: async (data) => {
        const response = await api.put('/user/preferences', data);
        return response.data;
    },
    getStats: async () => {
        const response = await api.get('/user/stats');
        return response.data;
    },
    submitCorrection: async (data) => {
        const response = await api.post('/user/corrections', data);
        return response.data;
    }
};
