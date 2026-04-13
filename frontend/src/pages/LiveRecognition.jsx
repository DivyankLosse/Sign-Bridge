import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCamera } from '../hooks/useCamera';
import { useWebSocket } from '../hooks/useWebSocket';
import RecognitionOverlay from '../components/RecognitionOverlay';
import PredictionDisplay from '../components/PredictionDisplay';
import TranscriptPanel from '../components/TranscriptPanel';
import { Play, Square, Settings, RefreshCw } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

const LiveRecognition = () => {
    const [isActive, setIsActive] = useState(false);
    const [useNlp, setUseNlp] = useState(true);
    const [transcript, setTranscript] = useState([]);
    const [systemError, setSystemError] = useState(null);
    const [mode, setMode] = useState("AUTO");
    const [threshold, setThreshold] = useState(0.7);

    // 1. WebSocket Hook (Provides isConnected and sendFrame)
    const { isConnected, predictionData, sendFrame } = useWebSocket(isActive);

    // 2. Frame capture callback (Uses isConnected and sendFrame)
    const handleFrame = useCallback((frameData) => {
        if (isActive && isConnected) {
            console.debug(`[Camera] Frame captured. Length: ${frameData.length}`);
            sendFrame(frameData, useNlp, mode, threshold);
        }
    }, [isActive, isConnected, useNlp, mode, threshold, sendFrame]);

    // 3. Camera Hook (Uses handleFrame)
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
        if (predictionData) {
            console.debug("[WS] Prediction received:", predictionData);
            
            if (predictionData.raw_prediction === "MODEL_NOT_LOADED") {
                setSystemError("Backend is warming up: Sign recognition model is currently loading. Please wait 10-20 seconds.");
                setModelLoading(true);
            } else {
                setModelLoading(false);
                // Clear system error if we are getting valid (even if null) predictions
                if (systemError && systemError.includes("warming up")) setSystemError(null);
            }

            // Show feedback if landmarks aren't detected
            if (predictionData.landmarks_detected === false && isActive) {
                // Only show if we haven't seen landmarks for a while (to avoid flickering)
                // For now, let's just log it or show a subtle UI hint
            }
        }
    }, [predictionData]);

    useEffect(() => {
        return () => {
            if (isActive) stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update transcript when prediction stabilizes
    useEffect(() => {
        if (predictionData) {
            const currentPred = predictionData.corrected_prediction;
            console.debug(`[Transcript] Eval: Current='${currentPred}', Last='${lastPredRef.current}'`);
            
            if (currentPred && currentPred !== "MODEL_NOT_LOADED") {
                if (currentPred !== lastPredRef.current) {
                    console.log(`[Transcript] NEW PREDICTION: ${currentPred}`);
                    setTranscript(prev => [...prev, {
                        text: currentPred,
                        raw: predictionData.raw_prediction,
                        confidence: predictionData.confidence,
                        timestamp: new Date()
                    }]);
                    lastPredRef.current = currentPred;
                }
            } else if (!currentPred) {
                // If the model returns None (no prediction), 
                // we reset the lastPredRef so the user can sign the same word again
                lastPredRef.current = null;
            }
        }
    }, [predictionData]);

    // Safety Guards (Production Hardening)
    if (systemError && !isActive) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-surface p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-4">Error loading translator</h2>
            <p className="text-gray-400 mb-6">{systemError}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white rounded-full">Retry</button>
        </div>
    );

    // Debug logging for production monitoring
    useEffect(() => {
        console.log(`[LiveRecognition] Environment: ${import.meta.env.MODE}`);
        console.log(`[LiveRecognition] API Base: ${import.meta.env.VITE_API_BASE_URL}`);
        console.log(`[LiveRecognition] WebSocket: ${isConnected ? 'Connected' : 'Disconnected'}`);
    }, [isConnected]);

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
                    <p className="text-gray-400">Elite Hybrid System: WLASL Words + ASL Fingerspelling.</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Mode Selector Royale */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex items-center shadow-inner">
                        <button 
                            onClick={() => setMode("AUTO")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'AUTO' ? 'bg-primary text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white'}`}
                        >
                            🟢 AUTO
                        </button>
                        <button 
                            onClick={() => setMode("WORDS")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'WORDS' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white'}`}
                        >
                            ✋ WORDS
                        </button>
                        <button 
                            onClick={() => setMode("SPELL")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'SPELL' ? 'bg-amber-600 text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white'}`}
                        >
                            🔤 SPELLING
                        </button>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-300 ml-2">
                        <input 
                            type="checkbox" 
                            checked={useNlp} 
                            onChange={(e) => setUseNlp(e.target.checked)} 
                            className="bg-gray-700 border-gray-600 rounded text-primary focus:ring-primary h-4 w-4"
                        />
                        NLP
                    </label>
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
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* SVG Overlay for landmarks representation or feedback */}
                            <RecognitionOverlay active={predictionData?.landmarks_detected} />
                            
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
                        <PredictionDisplay data={predictionData} useNlp={useNlp} />
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
