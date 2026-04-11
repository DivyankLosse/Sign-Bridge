import api from './api';

export const translateService = {
    /**
     * Translate speech transcription to sign language animations
     * @param {string} transcription - The transcribed text from microphone
     * @returns {Promise<Object>} - The response containing animation URLs
     */
    translateSpeech: async (transcription) => {
        const response = await api.post('/translate/speech', {
            transcription,
            language: 'en-IN'
        });
        return response.data;
    },

    /**
     * Translate text to sign language animations (simple mapping)
     * @param {string} text - The input text
     * @returns {Promise<Object>} - The response containing animation URLs
     */
    translateText: async (text) => {
        const response = await api.post('/translate/text', {
            text
        });
        return response.data;
    },

    /**
     * Get list of all available animations
     * @returns {Promise<Object>} - List of animated words
     */
    getAvailableAnimations: async () => {
        const response = await api.get('/translate/animations');
        return response.data;
    }
};
