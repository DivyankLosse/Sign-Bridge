import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, CameraOff, AlertCircle } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import RecognitionOverlay from '../RecognitionOverlay';
import api from '../../services/api';

const STABILITY_WINDOW = 5;
const CONFIDENCE_BUFFER_SIZE = 8;

export const CameraTrainer = ({
    isActive,
    fps = 5,
    expectedSign = null,
    onStablePrediction = null,
    onRawPrediction = null,
    confidenceThreshold = 0.7,
}) => {
    const [predictionData, setPredictionData] = useState(null);
    const [modelStatus, setModelStatus] = useState('connecting'); // connecting, ready, error, warming
    const [statusMessage, setStatusMessage] = useState('Initializing AI...');
    const [consecutiveCount, setConsecutiveCount] = useState(0);
    const [isConnected, setIsConnected] = useState(true);

    const predictionBuffer = useRef([]);
    const confidenceBuffer = useRef([]);
    const lastSendTimeRef = useRef(0);
    const isProcessingRef = useRef(false);
    const handLandmarkerRef = useRef(null);
    const handLandmarkerReadyRef = useRef(false);

    const frameInterval = 1000 / fps;

    useEffect(() => {
        let cancelled = false;

        const loadBrowserHandDetector = async () => {
            try {
                const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
                const vision = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm'
                );
                const detector = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                    },
                    numHands: 1,
                    runningMode: 'VIDEO',
                    minHandDetectionConfidence: 0.3,
                    minTrackingConfidence: 0.3,
                    minHandPresenceConfidence: 0.3,
                });

                if (!cancelled) {
                    handLandmarkerRef.current = detector;
                    handLandmarkerReadyRef.current = true;
                    setModelStatus('ready');
                    setStatusMessage('');
                }
            } catch {
                handLandmarkerRef.current = null;
                handLandmarkerReadyRef.current = false;
                if (!cancelled) {
                    // Keep the trainer usable with server fallback when available.
                    setModelStatus('ready');
                    setStatusMessage('');
                }
            }
        };

        loadBrowserHandDetector();

        return () => {
            cancelled = true;
            handLandmarkerRef.current?.close?.();
            handLandmarkerRef.current = null;
            handLandmarkerReadyRef.current = false;
        };
    }, []);

    const extractBrowserLandmarks = useCallback((videoElement, timestamp) => {
        if (!handLandmarkerReadyRef.current || !handLandmarkerRef.current || !videoElement) {
            return undefined;
        }

        try {
            const results = handLandmarkerRef.current.detectForVideo(videoElement, timestamp);
            const hand = results?.landmarks?.[0];
            if (!hand) {
                return null;
            }

            return hand.flatMap((landmark) => [landmark.x, landmark.y, landmark.z]);
        } catch {
            return undefined;
        }
    }, []);

    const handleFrame = useCallback(async (frameData, meta) => {
        if (!isActive || modelStatus !== 'ready' || isProcessingRef.current) {
            return;
        }

        const now = performance.now();
        if (now - lastSendTimeRef.current < frameInterval) {
            return;
        }

        lastSendTimeRef.current = now;
        isProcessingRef.current = true;

        try {
            const browserLandmarks = extractBrowserLandmarks(meta?.video, meta?.timestamp ?? now);
            const features =
                Array.isArray(browserLandmarks) && browserLandmarks.length === 63
                    ? browserLandmarks
                    : frameData;

            const response = await api.post('/asl/predict', { features });
            const data = response.data;

            setIsConnected(true);

            if (data.error) {
                if (data.error.includes('Model not loaded')) {
                    setModelStatus('warming');
                    setStatusMessage('AI model warming up... Try again in 10-20s');
                    setPredictionData(null);
                    return;
                }

                if (data.error.includes('No hands detected') || browserLandmarks === null) {
                    setPredictionData((prev) => (prev ? { ...prev, landmarks_detected: false } : null));
                    if (onRawPrediction) {
                        onRawPrediction({ prediction: '', confidence: 0, landmarksDetected: false });
                    }
                    return;
                }

                setModelStatus('error');
                setStatusMessage('AI recognition is unavailable right now.');
                setPredictionData(null);
                return;
            }

            const pred = data.prediction || '';
            const conf = data.confidence ?? 0;
            const nextPredictionData = {
                raw_prediction: pred,
                confidence: conf,
                landmarks_detected: data.landmarks_detected !== false,
            };

            setPredictionData(nextPredictionData);

            if (onRawPrediction) {
                onRawPrediction({
                    prediction: pred,
                    confidence: conf,
                    landmarksDetected: nextPredictionData.landmarks_detected,
                });
            }

            if (pred && expectedSign) {
                predictionBuffer.current.push(pred);
                confidenceBuffer.current.push(conf);

                if (predictionBuffer.current.length > STABILITY_WINDOW) {
                    predictionBuffer.current.shift();
                }
                if (confidenceBuffer.current.length > CONFIDENCE_BUFFER_SIZE) {
                    confidenceBuffer.current.shift();
                }

                const matchingFrames = predictionBuffer.current.filter((value) => value === expectedSign).length;
                setConsecutiveCount(matchingFrames);

                if (matchingFrames === STABILITY_WINDOW) {
                    const avgConf =
                        confidenceBuffer.current.reduce((acc, value) => acc + value, 0) /
                        confidenceBuffer.current.length;

                    if (avgConf >= confidenceThreshold) {
                        if (onStablePrediction) {
                            onStablePrediction(expectedSign, avgConf);
                        }
                        predictionBuffer.current = [];
                        confidenceBuffer.current = [];
                        setConsecutiveCount(0);
                    }
                }
            } else if (pred && !expectedSign && onStablePrediction) {
                onStablePrediction(pred, conf);
            }
        } catch {
            setIsConnected(false);
            setModelStatus('error');
            setStatusMessage('AI connection failed. Please try again.');
            setPredictionData(null);
        } finally {
            isProcessingRef.current = false;
        }
    }, [confidenceThreshold, expectedSign, extractBrowserLandmarks, frameInterval, isActive, modelStatus, onRawPrediction, onStablePrediction]);

    const { videoRef, canvasRef, error: cameraError, stopCamera, startCamera } = useCamera(handleFrame);

    useEffect(() => {
        if (!isActive) {
            predictionBuffer.current = [];
            confidenceBuffer.current = [];
            setConsecutiveCount(0);
            setPredictionData(null);
            return undefined;
        }

        if (!cameraError) {
            startCamera();
        }

        return () => {
            stopCamera();
        };
    }, [cameraError, isActive, startCamera, stopCamera]);

    if (cameraError) {
        return (
            <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 p-6 text-center">
                <CameraOff className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Camera Access Denied</h3>
                <p className="text-red-400/80 mb-4">{cameraError}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors">Grant Permission & Reload</button>
            </div>
        );
    }

    const showFallback = !isConnected || modelStatus === 'warming' || modelStatus === 'connecting' || modelStatus === 'error';

    return (
        <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-xl flex items-center justify-center">
            {showFallback && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                    {modelStatus === 'warming' ? (
                        <RefreshCw className="w-12 h-12 text-blue-400 animate-spin mb-4" />
                    ) : (
                        <AlertCircle className="w-12 h-12 text-yellow-400 mb-4" />
                    )}
                    <h3 className="text-xl font-bold text-white mb-2">
                        {statusMessage}
                    </h3>
                    {modelStatus !== 'warming' && modelStatus !== 'error' && (
                        <p className="text-gray-400 text-sm">Practicing without AI is still possible in Practice Mode.</p>
                    )}
                </div>
            )}

            {isActive && (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
                    />
                    <canvas
                        ref={canvasRef}
                        width={640}
                        height={480}
                        className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${showFallback ? 'opacity-30' : 'opacity-100'}`}
                    />
                    {!showFallback && (
                        <div className="absolute inset-0 pointer-events-none scale-x-[-1] z-10">
                            <RecognitionOverlay active={predictionData?.landmarks_detected} />
                        </div>
                    )}
                </>
            )}

            {!showFallback ? (
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-white font-medium border border-white/10 flex flex-col gap-1 z-30">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                        <span className="text-xs uppercase tracking-wider">AI Active</span>
                    </div>
                    {expectedSign && consecutiveCount > 0 && (
                        <div className="flex gap-1 mt-1">
                            {Array.from({ length: STABILITY_WINDOW }).map((_, index) => (
                                <div key={index} className={`h-1.5 w-4 rounded-full transition-all duration-200 ${index < consecutiveCount ? 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'bg-white/20'}`} />
                            ))}
                        </div>
                    )}
                </div>
            ) : null}

            {!showFallback && predictionData?.raw_prediction && !expectedSign && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 z-30">
                    <span className="text-2xl font-bold text-white">{predictionData.raw_prediction}</span>
                </div>
            )}
        </div>
    );
};
