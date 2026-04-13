import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCamera } from '../hooks/useCamera';
import RecognitionOverlay from '../components/RecognitionOverlay';
import PredictionDisplay from '../components/PredictionDisplay';
import TranscriptPanel from '../components/TranscriptPanel';
import { Play, Square, RefreshCw } from 'lucide-react';
import axios from 'axios';

const LiveRecognition = () => {
    const [isActive, setIsActive] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [systemError, setSystemError] = useState(null);
    const [modelLoading, setModelLoading] = useState(false);
    const [predictionData, setPredictionData] = useState(null);
    const [isConnected, setIsConnected] = useState(true);
    const lastPredRef = useRef(null);
    const isProcessingRef = useRef(false);

    const handleFrame = useCallback(async (frameData) => {
        if (!isActive || isProcessingRef.current) return;
        
        isProcessingRef.current = true;
        
        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
            const response = await axios.post(`${apiBase}/asl/predict`, {
                features: frameData
            });
            
            const data = response.data;
            if (data.error) {
                if (!data.error.includes("No hands detected")) {
                     console.error("Prediction error:", data.error);
                }
                setPredictionData(null);
                lastPredRef.current = null;
            } else if (data.prediction) {
                const currentPred = data.prediction;
                
                setPredictionData({
                    corrected_prediction: currentPred,
                    raw_prediction: currentPred,
                    confidence: 1.0,
                    landmarks_detected: true
                });
                
                if (currentPred && currentPred !== lastPredRef.current) {
                    setTranscript(prev => [...prev, {
                        text: currentPred,
                        raw: currentPred,
                        confidence: 1.0,
                        timestamp: new Date()
                    }]);
                    lastPredRef.current = currentPred;
                }
            }
            setIsConnected(true);
            setSystemError(null);
        } catch (error) {
            console.error("Frame send error:", error);
            setIsConnected(false);
            setSystemError("Failed to connect to backend server");
        } finally {
            isProcessingRef.current = false;
        }
    }, [isActive]);

    // Camera Hook
    const { videoRef, canvasRef, startCamera, stopCamera, error: cameraError } = useCamera(handleFrame);

    const toggleSession = () => {
        if (isActive) {
            stopCamera();
            setIsActive(false);
            setSystemError(null);
        } else {
            startCamera();
            setIsActive(true);
        }
    };

    useEffect(() => {
        return () => {
            if (isActive) stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (systemError && !isActive) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-4">Error loading translator</h2>
            <p className="text-gray-400 mb-6">{systemError}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white rounded-full">Retry</button>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto h-full flex flex-col pt-0 pb-0">
            <header className="mb-6 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        Sign Bridge Translator
                        {isActive && (
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-400">Production-grade ASL Fingerspelling system.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleSession}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                            isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-primary hover:bg-primary-light text-white'
                        }`}
                    >
                        {isActive ? <><Square className="w-4 h-4 fill-current" /> Stop</> : <><Play className="w-4 h-4 fill-current" /> Start</>}
                    </button>
                </div>
            </header>

            {(cameraError || systemError) && (
                <div className={`border px-4 py-3 rounded-xl mb-6 flex items-center gap-3 shrink-0 transition-colors ${
                    systemError ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                    {modelLoading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                        <span className="material-symbols-outlined">error</span>
                    )}
                    <span className="text-sm font-medium">{systemError || cameraError}</span>
                </div>
            )}

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 overflow-hidden min-h-[500px]">
                {/* Camera View */}
                <div className="lg:col-span-2 relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
                    {!isActive ? (
                        <div className="text-center text-gray-500 z-10">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-50">videocam_off</span>
                            <p>Camera is paused. Click Start to begin.</p>
                        </div>
                    ) : (
                        <>
                            {/* Hidden video element for capture */}
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                muted 
                                className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
                            />
                            {/* Visible canvas for streaming & overlay */}
                            <canvas 
                                ref={canvasRef} 
                                width={640} 
                                height={480} 
                                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                            />
                            {/* SVG Overlay for landmarks representation or feedback */}
                            <div className="absolute inset-0 pointer-events-none scale-x-[-1]">
                                <RecognitionOverlay active={predictionData?.landmarks_detected} />
                            </div>
                            
                            {/* Status Pill */}
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                <span className="text-xs font-mono text-white/80 uppercase tracking-wider">
                                    {isConnected ? 'Connected' : 'Reconnecting...'}
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Panel with strict null-guards */}
                <div className="flex flex-col gap-4 overflow-hidden">
                    {predictionData ? (
                        <PredictionDisplay data={predictionData} useNlp={false} />
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shrink-0 opacity-50">
                            <p className="text-xs text-on-surface-variant/50 uppercase font-bold tracking-widest">Awaiting Data...</p>
                        </div>
                    )}
                    <TranscriptPanel entries={transcript || []} />
                </div>
            </div>
        </div>
    );
};

export default LiveRecognition;
