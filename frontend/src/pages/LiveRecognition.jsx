import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCamera } from '../hooks/useCamera';
import RecognitionOverlay from '../components/RecognitionOverlay';
import PredictionDisplay from '../components/PredictionDisplay';
import TranscriptPanel from '../components/TranscriptPanel';
import { Play, Square } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import api from '../services/api';

const REQUESTS_PER_SECOND = 5;
const REQUEST_INTERVAL_MS = 1000 / REQUESTS_PER_SECOND;
const STABLE_FRAME_THRESHOLD = 2;
const CLEAR_PREDICTION_AFTER_MISSES = 4;
const MAX_TRANSCRIPT_ENTRIES = 50;

const LiveRecognition = () => {
    const [isActive, setIsActive] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [systemError, setSystemError] = useState(null);
    const [predictionData, setPredictionData] = useState(null);
    const [isConnected, setIsConnected] = useState(true);
    const [detectorStatus, setDetectorStatus] = useState('idle');
    const [pipelineSource, setPipelineSource] = useState('server');
    const lastPredRef = useRef(null);
    const isProcessingRef = useRef(false);
    const lastRequestAtRef = useRef(0);
    const stablePredictionRef = useRef({ value: null, count: 0 });
    const missCountRef = useRef(0);
    const handLandmarkerRef = useRef(null);
    const handLandmarkerReadyRef = useRef(false);
    const latestTranscriptEntry = transcript[transcript.length - 1] || null;
    const activeDisplayText =
        predictionData?.corrected_prediction ||
        predictionData?.raw_prediction ||
        (detectorStatus === 'no_hand' ? 'Hand not detected' : '') ||
        latestTranscriptEntry?.text ||
        '';

    const saveHistoryEntry = useCallback(async (content) => {
        try {
            await api.post('/history', {
                type: 'sign-to-text',
                content,
                confidence: 1.0,
                source: 'translator',
            });
        } catch (error) {
            console.error('Failed to persist translator history', error);
        }
    }, []);

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
                    setPipelineSource('browser');
                }
            } catch (error) {
                console.error('[LiveRecognition] Failed to load browser hand detector', error);
                handLandmarkerRef.current = null;
                handLandmarkerReadyRef.current = false;
                setPipelineSource('server');
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
        } catch (error) {
            console.error('[LiveRecognition] Browser hand detection failed', error);
            return undefined;
        }
    }, []);

    const handleFrame = useCallback(async (frameData, meta) => {
        if (!isActive || isProcessingRef.current) return;

        const now = performance.now();
        if (now - lastRequestAtRef.current < REQUEST_INTERVAL_MS) {
            return;
        }
        
        isProcessingRef.current = true;
        lastRequestAtRef.current = now;
        
        try {
            const browserLandmarks = extractBrowserLandmarks(meta?.video, meta?.timestamp ?? now);
            if (browserLandmarks === null) {
                missCountRef.current += 1;
                setDetectorStatus('no_hand');
                setPredictionData(prev => prev ? { ...prev, landmarks_detected: false } : null);
                if (missCountRef.current >= CLEAR_PREDICTION_AFTER_MISSES) {
                    setPredictionData(null);
                    stablePredictionRef.current = { value: null, count: 0 };
                }
                setIsConnected(true);
                setSystemError(null);
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/asl/predict`, {
                features: Array.isArray(browserLandmarks) && browserLandmarks.length === 63 ? browserLandmarks : frameData
            });
            
            const data = response.data;
            if (data.error) {
                if (data.error.includes("Server hand detector unavailable")) {
                    console.error("Prediction error:", data.error);
                    setSystemError("Browser hand detector unavailable and server fallback is disabled.");
                    setDetectorStatus('error');
                    setIsConnected(true);
                    return;
                }
                if (!data.error.includes("No hands detected")) {
                     console.error("Prediction error:", data.error);
                     setSystemError(data.error);
                     setDetectorStatus('error');
                     setIsConnected(true);
                     return;
                }
                if (data.error.includes("No hands detected")) {
                    missCountRef.current += 1;
                    setDetectorStatus('no_hand');
                    setPredictionData(prev => prev ? { ...prev, landmarks_detected: false } : null);
                    if (missCountRef.current >= CLEAR_PREDICTION_AFTER_MISSES) {
                        setPredictionData(null);
                        stablePredictionRef.current = { value: null, count: 0 };
                    }
                } else {
                    setDetectorStatus('idle');
                    setPredictionData(null);
                    stablePredictionRef.current = { value: null, count: 0 };
                }
                setIsConnected(true);
                setSystemError(null);
            } else if (data.prediction) {
                const currentPred = String(data.prediction).trim();
                if (!currentPred) {
                    return;
                }

                missCountRef.current = 0;
                setDetectorStatus('detected');
                setPipelineSource(data.source || (Array.isArray(browserLandmarks) ? 'browser' : 'server'));
                setPredictionData({
                    corrected_prediction: currentPred,
                    raw_prediction: currentPred,
                    confidence: data.confidence ?? 1.0,
                    landmarks_detected: data.landmarks_detected !== false,
                    source: data.source || 'unknown',
                });
                
                if (stablePredictionRef.current.value === currentPred) {
                    stablePredictionRef.current.count += 1;
                } else {
                    stablePredictionRef.current = { value: currentPred, count: 1 };
                }

                if (
                    stablePredictionRef.current.count >= STABLE_FRAME_THRESHOLD &&
                    currentPred !== lastPredRef.current
                ) {
                    setTranscript(prev => {
                        const nextEntries = [
                            ...prev,
                            {
                                text: currentPred,
                                raw: currentPred,
                                confidence: 1.0,
                                timestamp: new Date().toISOString()
                            }
                        ];
                        const trimmedEntries = nextEntries.slice(-MAX_TRANSCRIPT_ENTRIES);
                        console.debug('[LiveRecognition] appending transcript entry', {
                            prediction: currentPred,
                            nextLength: trimmedEntries.length,
                            latestEntry: trimmedEntries[trimmedEntries.length - 1]
                        });
                        return trimmedEntries;
                    });
                    lastPredRef.current = currentPred;
                    saveHistoryEntry(currentPred);
                }
                setIsConnected(true);
                setSystemError(null);
            }
        } catch (error) {
            console.error("Frame send error:", error);
            setIsConnected(false);
            setSystemError("Failed to connect to backend server");
            setDetectorStatus('error');
        } finally {
            isProcessingRef.current = false;
        }
    }, [extractBrowserLandmarks, isActive, saveHistoryEntry]);

    // Camera Hook
    const { videoRef, canvasRef, startCamera, stopCamera, error: cameraError } = useCamera(handleFrame, {
        targetFps: 4,
        jpegQuality: 0.92
    });

    useEffect(() => {
        console.debug('[LiveRecognition] transcript state updated', transcript);
    }, [transcript]);

    useEffect(() => {
        localStorage.setItem('translatorSessionActive', isActive ? 'true' : 'false');
        return () => {
            if (!isActive) {
                localStorage.removeItem('translatorSessionActive');
            }
        };
    }, [isActive]);

    const toggleSession = () => {
        if (isActive) {
            stopCamera();
            setIsActive(false);
            setSystemError(null);
            setPredictionData(null);
            setDetectorStatus('idle');
            lastRequestAtRef.current = 0;
            stablePredictionRef.current = { value: null, count: 0 };
            missCountRef.current = 0;
            lastPredRef.current = null;
            localStorage.removeItem('translatorSessionActive');
        } else {
            startCamera();
            setIsActive(true);
            setDetectorStatus('searching');
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
        <div className="p-6 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto h-full flex flex-col">
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
                    <span className="material-symbols-outlined">error</span>
                    <span className="text-sm font-medium">{systemError || cameraError}</span>
                </div>
            )}

            <div className="mb-4 md:hidden">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-xs text-on-surface-variant/50 uppercase font-bold tracking-widest mb-2">
                        Live Output
                    </p>
                    <p className="text-2xl font-bold text-white min-h-[2rem]">
                        {activeDisplayText || 'Waiting for gesture...'}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        {detectorStatus === 'no_hand'
                            ? 'Move one hand fully into frame'
                            : detectorStatus === 'detected'
                                ? `Transcript entries: ${transcript.length} · ${pipelineSource}`
                                : 'Align your hand inside the camera frame'}
                    </p>
                </div>
            </div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 overflow-visible md:overflow-hidden min-h-[500px]">
                {/* Camera View */}
                <div className="md:col-span-2 relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center min-h-[320px] md:min-h-0">
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

                            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-sm bg-black/65 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
                                <p className="text-[10px] font-bold tracking-[0.18em] text-white/60 uppercase mb-1">
                                    Live Output
                                </p>
                                <p className="text-xl md:text-2xl font-bold text-white leading-tight min-h-[1.75rem]">
                                    {activeDisplayText || 'Waiting for gesture...'}
                                </p>
                                <p className="text-xs text-white/50 mt-1">
                                    {detectorStatus === 'no_hand'
                                        ? 'Move one hand fully into frame'
                                        : detectorStatus === 'detected'
                                            ? `Transcript entries: ${transcript.length} · ${pipelineSource}`
                                            : 'Align your hand inside the camera frame'}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Panel with strict null-guards */}
                <div className="flex flex-col gap-4 overflow-visible md:overflow-hidden min-h-[260px]">
                    {predictionData ? (
                        <PredictionDisplay data={predictionData} useNlp={false} />
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shrink-0">
                            <p className="text-xs text-on-surface-variant/50 uppercase font-bold tracking-widest mb-2">Detector Status</p>
                            <p className="text-lg font-semibold text-white">
                                {detectorStatus === 'no_hand'
                                    ? 'Hand not detected'
                                    : detectorStatus === 'error'
                                        ? 'Prediction error'
                                        : detectorStatus === 'searching'
                                            ? 'Searching for hand...'
                                            : 'Awaiting data...'}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                                {detectorStatus === 'no_hand'
                                    ? 'Try moving your hand farther from the camera with your full palm visible.'
                                    : detectorStatus === 'error'
                                        ? 'The backend responded, but prediction did not complete.'
                                        : 'Start the camera and keep one well-lit hand centered in frame.'}
                            </p>
                        </div>
                    )}
                    <div className="min-h-0 flex-1">
                        <TranscriptPanel entries={transcript} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveRecognition;
