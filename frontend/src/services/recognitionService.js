import { WEBSOCKET_URL } from '../utils/constants';

export const createRecognitionSocket = (token, onMessage, onError, onClose) => {
    const wsUrl = `${WEBSOCKET_URL}/ws/recognize${token ? `?token=${token}` : ''}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'prediction' && onMessage) {
                onMessage(data);
            }
        } catch (e) {
            console.error('Failed to parse websocket message', e);
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket Error', error);
        if (onError) onError(error);
    };

    ws.onclose = () => {
        if (onClose) onClose();
    };

    return {
        sendFrame: (base64Frame, useNlp = true, mode = "AUTO", threshold = 0.7) => {
            if (ws.readyState === WebSocket.OPEN) {
                // Throttle sending if WebSocket buffer is backing up (e.g. slow connection)
                if (ws.bufferedAmount < 1024 * 1024) {
                    ws.send(JSON.stringify({ 
                        frame: base64Frame, 
                        nlp_correction: useNlp,
                        mode: mode,
                        threshold: threshold
                    }));
                } else {
                    console.warn('WS buffer full, dropping frame to avoid latency');
                }
            }
        },
        close: () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        }
    };
};
