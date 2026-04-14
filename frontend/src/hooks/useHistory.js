import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const normalizeHistoryItem = (item) => ({
    ...item,
    predicted_text: item.content,
    original_text: item.content,
    timestamp: item.timestamp || item.created_at,
});

export const useHistory = () => {
    const [history, setHistory] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchHistory = useCallback(async ({ skip = 0, limit = 50, type } = {}) => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams({
                skip: String(skip),
                limit: String(limit),
            });
            if (type) {
                params.set('type', type);
            }
            const response = await api.get(`/history?${params.toString()}`);
            setHistory((response.data.items || []).map(normalizeHistoryItem));
            setTotal(response.data.total);
        } catch (e) {
            setError(e.userMessage || 'Unable to load history right now.');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteItem = async (id) => {
        try {
            await api.delete(`/history/${id}`);
            setHistory(prev => prev.filter(item => item.id !== id));
            setTotal(prev => Math.max(0, prev - 1));
        } catch (e) {
            setError(e.userMessage || 'Unable to delete this history item.');
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return { history, total, loading, error, fetchHistory, deleteItem };
};
