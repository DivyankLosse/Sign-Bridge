import { useState, useEffect, useRef, useCallback } from 'react';
import { createRecognitionSocket } from '../services/recognitionService';
import { useAuth } from '../context/AuthContext';

export const useWebSocket = (isActive) => {
    const { token } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [predictionData, setPredictionData] = useState(null);
    const wsRef = useRef(null);

    useEffect(() => {
        let timeoutId;
        const connect = () => {
            if (wsRef.current) return;
            
            const socket = createRecognitionSocket(
                token,
                (data) => setPredictionData(data),
                (error) => console.error('WS Error:', error),
                () => {
                    setIsConnected(false);
                    wsRef.current = null;
                    if (isActive) {
                        timeoutId = setTimeout(connect, 2000);
                    }
                }
            );
            
            wsRef.current = socket;
            setIsConnected(true);
        };

        if (isActive && !isConnected) {
            connect();
        } else if (!isActive && isConnected) {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
                setIsConnected(false);
                setPredictionData(null);
            }
        }
        
        return () => {
            clearTimeout(timeoutId);
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [isActive, isConnected, token]);

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
            setIsConnected(false);
            setPredictionData(null);
        }
    }, []);



    const sendFrame = useCallback((frame, useNlp) => {
        if (wsRef.current && isConnected) {
            wsRef.current.sendFrame(frame, useNlp);
        }
    }, [isConnected]);

    return { isConnected, predictionData, sendFrame };
};
