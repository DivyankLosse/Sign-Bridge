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
            // Strict guard: don't connect if hidden or already connecting/connected
            if (!isActive || wsRef.current) return;
            
            console.log("[WS] Attempting connection...");
            const socket = createRecognitionSocket(
                token,
                (data) => setPredictionData(data),
                (error) => {
                    console.error('WS Error:', error);
                    setIsConnected(false);
                },
                () => {
                    setIsConnected(false);
                    wsRef.current = null;
                    // Only retry if still active
                    if (isActive) {
                        console.log("[WS] Disconnected. Retrying in 2s...");
                        timeoutId = setTimeout(connect, 2000);
                    }
                }
            );
            
            wsRef.current = socket;
            setIsConnected(true);
        };

        if (isActive) {
            connect();
        } else {
            // Clear everything on inactive
            if (wsRef.current) {
                console.log("[WS] Closing connection (user stopped)");
                wsRef.current.close();
                wsRef.current = null;
            }
            setIsConnected(false);
            setPredictionData(null);
        }
        
        return () => {
            clearTimeout(timeoutId);
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [isActive, token]);

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
            setIsConnected(false);
            setPredictionData(null);
        }
    }, []);



    const sendFrame = useCallback((frame, useNlp, mode, threshold) => {
        if (wsRef.current && isConnected) {
            wsRef.current.sendFrame(frame, useNlp, mode, threshold);
        }
    }, [isConnected]);

    return { isConnected, predictionData, sendFrame };
};
