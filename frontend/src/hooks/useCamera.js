import { useState, useRef, useEffect } from 'react';

export const useCamera = (onFrame) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);
    
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
                setError(null);
            }
        } catch (err) {
            console.error("Camera access error:", err);
            setError("Could not access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            setIsStreaming(false);
        }
    };

    // Capture loop
    useEffect(() => {
        let animationFrameId;
        let lastProcessTime = 0;
        const TARGET_FPS = 10;
        const frameInterval = 1000 / TARGET_FPS;

        const processFrame = (timestamp) => {
            if (!isStreaming || !canvasRef.current || !videoRef.current) return;
            
            // Check if video is actually ready and playing
            if (videoRef.current.readyState < 2) {
                animationFrameId = requestAnimationFrame(processFrame);
                return;
            }

            // Throttle to target FPS
            if (timestamp - lastProcessTime >= frameInterval) {
                lastProcessTime = timestamp;
                try {
                    const context = canvasRef.current.getContext('2d');
                    context.drawImage(videoRef.current, 0, 0, 640, 480);
                    
                    const frameData = canvasRef.current.toDataURL('image/jpeg', 0.8);
                    if (onFrame) onFrame(frameData);
                } catch (err) {
                    console.error("Frame processing error:", err);
                }
            }
            
            animationFrameId = requestAnimationFrame(processFrame);
        };

        if (isStreaming) {
            animationFrameId = requestAnimationFrame(processFrame);
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isStreaming, onFrame]);

    return { videoRef, canvasRef, isStreaming, startCamera, stopCamera, error };
};
