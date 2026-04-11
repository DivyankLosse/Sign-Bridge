import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useHistory = () => {
    const [history, setHistory] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchHistory = useCallback(async (skip = 0, limit = 50) => {
        setLoading(true);
        try {
            const response = await api.get(`/history?skip=${skip}&limit=${limit}`);
            setHistory(response.data.items);
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
            setTotal(prev => prev - 1);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return { history, total, loading, fetchHistory, deleteItem };
};
