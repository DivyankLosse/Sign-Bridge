import { useState, useRef, useEffect, useCallback } from 'react';

export const useCamera = (onFrame, options = {}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);
    const targetFps = options.targetFps ?? 10;
    const jpegQuality = options.jpegQuality ?? 0.92;
    const lazyFrameData = options.lazyFrameData ?? false;
    
    const startCamera = useCallback(async () => {
        if (videoRef.current?.srcObject) {
            setIsStreaming(true);
            setError(null);
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: targetFps, max: 30 }
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsStreaming(true);
                setError(null);
            }
        } catch {
            setError("Could not access camera. Please check permissions.");
        }
    }, [targetFps]);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsStreaming(false);
        }
    }, []);

    // Capture loop
    useEffect(() => {
        let animationFrameId;
        let lastProcessTime = 0;
        const frameInterval = 1000 / targetFps;

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
                    if (!context) {
                        animationFrameId = requestAnimationFrame(processFrame);
                        return;
                    }
                    context.drawImage(videoRef.current, 0, 0, 640, 480);

                    const getFrameData = () => canvasRef.current.toDataURL('image/jpeg', jpegQuality);
                    if (onFrame) {
                        const meta = {
                            video: videoRef.current,
                            canvas: canvasRef.current,
                            timestamp,
                            getFrameData,
                        };

                        if (lazyFrameData) {
                            onFrame({ getFrameData }, meta);
                        } else {
                            onFrame(getFrameData(), meta);
                        }
                    }
                } catch {
                    setError("There was a problem processing the camera frame.");
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
    }, [isStreaming, onFrame, targetFps, jpegQuality, lazyFrameData]);

    return { videoRef, canvasRef, isStreaming, startCamera, stopCamera, error };
};
