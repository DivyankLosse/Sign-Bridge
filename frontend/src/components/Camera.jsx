import React, { useRef, useEffect, useState } from 'react';
import { Camera as CameraIcon, StopCircle } from 'lucide-react';
import api from '../services/api';
import { ENDPOINTS } from '../utils/constants';

const Camera = ({ onPrediction }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [prediction, setPrediction] = useState('');
    const [confidence, setConfidence] = useState(0);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow permissions.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            setIsStreaming(false);
        }
    };

    const captureAndPredict = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const context = canvasRef.current.getContext('2d');
        // Draw video frame to canvas
        context.drawImage(videoRef.current, 0, 0, 640, 480);

        // Get base64 data
        const base64Data = canvasRef.current.toDataURL('image/jpeg');

        try {
            const response = await api.post(ENDPOINTS.PREDICT, { frame: base64Data });
            if (response.data.prediction) {
                const pred = response.data.prediction;
                const conf = response.data.confidence;

                setPrediction(pred);
                setConfidence(conf);

                // Call parent callback if it exists
                if (onPrediction) {
                    onPrediction(pred, conf);
                }
            }
        } catch (err) {
            console.error("Prediction error", err);
        }
    };

    useEffect(() => {
        let interval;
        if (isStreaming) {
            interval = setInterval(() => {
                captureAndPredict();
            }, 300); // 3-4 FPS
        }
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStreaming]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '640px', height: '480px', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    width="640"
                    height="480"
                    style={{ display: isStreaming ? 'block' : 'none' }}
                />
                {!isStreaming && (
                    <div style={{
                        display: 'flex',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-secondary)'
                    }}>
                        Camera is off
                    </div>
                )}
                {/* Overlay Prediction */}
                {isStreaming && prediction && (
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                    }}>
                        {prediction} <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>({(confidence * 100).toFixed(1)}%)</span>
                    </div>
                )}
            </div>

            <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />

            <div style={{ display: 'flex', gap: '1rem' }}>
                {!isStreaming ? (
                    <button className="primary-btn" onClick={startCamera}>
                        <CameraIcon size={20} style={{ marginRight: '8px' }} /> Start Camera
                    </button>
                ) : (
                    <button className="glass-panel" onClick={stopCamera} style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', padding: '12px 24px', cursor: 'pointer' }}>
                        <StopCircle size={20} style={{ marginRight: '8px' }} /> Stop
                    </button>
                )}
            </div>
        </div>
    );
};

export default Camera;
