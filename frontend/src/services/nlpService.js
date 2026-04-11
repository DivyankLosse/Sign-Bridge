import api from './api';

export const nlpService = {
    correctText: async (text) => {
        const response = await api.post('/nlp/correct', { text });
        return response.data;
    },
    correctBatch: async (texts) => {
        const response = await api.post('/nlp/correct-batch', { texts });
        return response.data;
    }
};
