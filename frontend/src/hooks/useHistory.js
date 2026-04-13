import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const normalizeHistoryItem = (item) => ({
    ...item,
    predicted_text: item.content,
    original_text: item.content,
});

export const useHistory = () => {
    const [history, setHistory] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchHistory = useCallback(async ({ skip = 0, limit = 50, type } = {}) => {
        setLoading(true);
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
            console.error(e);
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
            console.error(e);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return { history, total, loading, fetchHistory, deleteItem };
};
