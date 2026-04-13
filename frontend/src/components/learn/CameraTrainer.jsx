import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { useWebSocket } from '../../hooks/useWebSocket';
import RecognitionOverlay from '../RecognitionOverlay';
import { RefreshCw, CameraOff, AlertCircle } from 'lucide-react';

const STABILITY_WINDOW = 5;
const CONFIDENCE_BUFFER_SIZE = 8;

export const CameraTrainer = ({ 
    isActive, 
    fps = 5, 
    expectedSign = null, 
    onStablePrediction = null,
    onRawPrediction = null,
    confidenceThreshold = 0.7 
}) => {
    const { isConnected, predictionData, sendFrame } = useWebSocket(isActive);
    const [modelStatus, setModelStatus] = useState('connecting'); // connecting, ready, error, warming
    const [statusMessage, setStatusMessage] = useState('Connecting to AI...');
    const [consecutiveCount, setConsecutiveCount] = useState(0);

    // Buffers for prediction stability
    const predictionBuffer = useRef([]);
    const confidenceBuffer = useRef([]);

    // Frame request loop logic for fixed FPS
    const lastSendTimeRef = useRef(0);
    const frameInterval = 1000 / fps;

    const handleFrame = useCallback((frameData) => {
        if (isActive && isConnected && modelStatus === 'ready') {
            const now = performance.now();
            if (now - lastSendTimeRef.current >= frameInterval) {
                lastSendTimeRef.current = now;
                // Hardcode SPELL mode and true for NLP (though NLP won't do much for single letters)
                sendFrame(frameData, false, 'SPELL', confidenceThreshold);
            }
        }
    }, [isActive, isConnected, modelStatus, frameInterval, sendFrame, confidenceThreshold]);

    const { videoRef, canvasRef, error: cameraError, stopCamera, startCamera } = useCamera(handleFrame);

    useEffect(() => {
        if (isActive && !cameraError) {
             startCamera();
        }
        return () => stopCamera();
    }, [isActive, cameraError]);

    useEffect(() => {
        if (!isActive) {
            predictionBuffer.current = [];
            confidenceBuffer.current = [];
            setConsecutiveCount(0);
            return;
        }

        if (!isConnected) {
             setModelStatus('connecting');
             setStatusMessage('Connection lost — retrying...');
             return;
        }

        if (predictionData) {
            if (predictionData.raw_prediction === "MODEL_NOT_LOADED" || predictionData.raw_prediction === "MODEL_ERROR") {
                setModelStatus('warming');
                setStatusMessage('AI model warming up... Try again in 10-20s');
                return;
            }

            setModelStatus('ready');
            setStatusMessage('');

            const pred = predictionData.raw_prediction;
            const conf = predictionData.confidence;

            if (onRawPrediction) {
                onRawPrediction({ prediction: pred, confidence: conf, landmarksDetected: predictionData.landmarks_detected });
            }

            // Stabilizer Logic
            if (pred && expectedSign) {
                predictionBuffer.current.push(pred);
                confidenceBuffer.current.push(conf);

                if (predictionBuffer.current.length > STABILITY_WINDOW) {
                    predictionBuffer.current.shift();
                }
                if (confidenceBuffer.current.length > CONFIDENCE_BUFFER_SIZE) {
                    confidenceBuffer.current.shift();
                }

                // If expected sign passed, check only against expected sign
                const matchingFrames = predictionBuffer.current.filter(p => p === expectedSign).length;
                setConsecutiveCount(matchingFrames);

                if (matchingFrames === STABILITY_WINDOW) {
                    const avgConf = confidenceBuffer.current.reduce((a, b) => a + b, 0) / confidenceBuffer.current.length;
                    if (avgConf >= confidenceThreshold) {
                         if (onStablePrediction) onStablePrediction(expectedSign, avgConf);
                         // Clear buffer after success to prevent immediate re-trigger
                         predictionBuffer.current = [];
                         confidenceBuffer.current = [];
                         setConsecutiveCount(0);
                    }
                }
            } else if (pred && !expectedSign && onStablePrediction) {
                // If no expected sign is passed (e.g. Free Practice mode), just pass raw but debounced
                 onStablePrediction(pred, conf);
            }
        }
    }, [predictionData, isActive, isConnected, expectedSign, confidenceThreshold, onStablePrediction, onRawPrediction]);

    // UI Feedback
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

    const showFallback = !isConnected || modelStatus === 'warming' || modelStatus === 'connecting';

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
                    {modelStatus !== 'warming' && (
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
                    {!showFallback && <div className="absolute inset-0 pointer-events-none scale-x-[-1] z-10"><RecognitionOverlay active={predictionData?.landmarks_detected} /></div>}
                </>
            )}

            {/* Stability Ring / Connection Status Override */}
            {!showFallback ? (
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-white font-medium border border-white/10 flex flex-col gap-1 z-30">
                    <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                         <span className="text-xs uppercase tracking-wider">AI Active</span>
                    </div>
                    {expectedSign && consecutiveCount > 0 && (
                        <div className="flex gap-1 mt-1">
                            {Array.from({length: STABILITY_WINDOW}).map((_, i) => (
                                <div key={i} className={`h-1.5 w-4 rounded-full transition-all duration-200 ${i < consecutiveCount ? 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'bg-white/20'}`} />
                            ))}
                        </div>
                    )}
                </div>
            ) : null}
            
            {/* Display predicted letter if not stabilizing */}
            {!showFallback && predictionData?.raw_prediction && !expectedSign && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 z-30">
                      <span className="text-2xl font-bold text-white">{predictionData.raw_prediction}</span>
                  </div>
            )}
        </div>
    );
};
