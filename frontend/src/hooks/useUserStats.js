import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const useUserStats = (intervalMs = 60000) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchStats = async () => {
            try {
                const data = await userService.getStats();
                if (mounted) {
                    setStats(data);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching stats", err);
                if (mounted) setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, intervalMs);
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [intervalMs]);

    return { stats, loading };
};
