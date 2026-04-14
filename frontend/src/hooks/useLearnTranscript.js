import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'signbridge_transcripts';

export const useLearnTranscript = () => {
    const [transcripts, setTranscripts] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch {
            // Ignore malformed persisted transcript data and start fresh.
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transcripts));
    }, [transcripts]);

    const logActivity = useCallback((activity) => {
        // activity expected shape: { source: "learn", mode: "test", sign: "A", result: "correct", confidence: 0.89, level: 1, subLevel: "1-3" }
        setTranscripts(prev => [
            ...prev,
            {
                ...activity,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString()
            }
        ]);
    }, []);

    const clearTranscripts = useCallback(() => {
        setTranscripts([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const getTodayLearningCount = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        return transcripts.filter(t => 
            t.source === "learn" && 
            t.result === "correct" && 
            t.timestamp.startsWith(today)
        ).length;
    }, [transcripts]);

    return {
        transcripts,
        logActivity,
        clearTranscripts,
        getTodayLearningCount
    };
};
