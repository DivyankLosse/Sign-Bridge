import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { translateService } from '../services/translateService';
import AnimationPlayer from './AnimationPlayer';

const SpeechToSign = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [animations, setAnimations] = useState([]); // List of video URLs
    const [processedWords, setProcessedWords] = useState([]); // List of words text
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [supported, setSupported] = useState(true);

    // Initialize Web Speech API
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            setSupported(false);
        }
    }, []);

    const startRecording = () => {
        setError(null);
        setIsRecording(true);
        setTranscription('');

        try {
            const recognition = new window.webkitSpeechRecognition();
            recognition.lang = 'en-IN';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = async (event) => {
                const text = event.results[0][0].transcript;
                setTranscription(text);
                setIsRecording(false);
                await handleTranslation(text);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setError("Could not recognize speech. Please try again.");
                setIsRecording(false);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognition.start();
        } catch (err) {
            console.error("Speech API error", err);
            setError("Microphone access denied or not supported.");
            setIsRecording(false);
        }
    };

    const handleTranslation = async (text) => {
        if (!text) return;

        setIsLoading(true);
        try {
            const result = await translateService.translateSpeech(text);
            setAnimations(result.animations || []);
            setProcessedWords(result.processed_words || []);
        } catch (err) {
            console.error("Translation error", err);
            setError("Failed to translate speech. Server might be offline.");
        } finally {
            setIsLoading(false);
        }
    };

    // Manual text input fallback
    const handleManualSubmit = async (e) => {
        e.preventDefault();
        await handleTranslation(transcription);
    };

    return (
        <div style={{ padding: '0 1rem' }}>
            {/* Input Section */}
            <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Speak to Translate</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Click the microphone and speak clearly in English
                    </p>
                </div>

                {supported ? (
                    <button
                        onClick={startRecording}
                        className={`mic-btn ${isRecording ? 'recording' : ''}`}
                        disabled={isRecording || isLoading}
                        style={{
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            border: 'none',
                            background: isRecording ? 'var(--error-red)' : 'var(--accent-purple)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: isRecording ? '0 0 30px rgba(255,59,48,0.5)' : '0 10px 30px rgba(124,58,237,0.3)',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                    >
                        {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
                    </button>
                ) : (
                    <div style={{
                        color: 'var(--warning-yellow)',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(255,204,0,0.1)', padding: '12px', borderRadius: '8px'
                    }}>
                        <AlertCircle size={20} /> Browser does not support speech recognition
                    </div>
                )}

                <form onSubmit={handleManualSubmit} style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
                    <input
                        type="text"
                        value={transcription}
                        onChange={(e) => setTranscription(e.target.value)}
                        placeholder={isRecording ? "Listening..." : "Type text here..."}
                        disabled={isRecording}
                        style={{
                            width: '100%', padding: '16px 50px 16px 16px', borderRadius: '12px',
                            background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white', fontSize: '1rem', outline: 'none',
                            textAlign: 'left'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!transcription.trim() || isLoading}
                        style={{
                            position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                            background: 'var(--accent-purple)', border: 'none', borderRadius: '8px',
                            padding: '8px', color: 'white', cursor: 'pointer',
                            opacity: (!transcription.trim() || isLoading) ? 0.5 : 1
                        }}
                    >
                        {isLoading ? (
                            <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <AlertCircle style={{ transform: 'rotate(180deg)', display: 'none' }} /> // Dummy to keep import
                        )}
                        {/* Use CSS arrow or icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                </form>

                {error && (
                    <p style={{ color: 'var(--error-red)', fontSize: '0.9rem' }}>{error}</p>
                )}

                {/* Show message if processed successfully but no animations found */}
                {!isLoading && !error && processedWords.length > 0 && animations.length === 0 && (
                    <div style={{ color: 'var(--warning-yellow)', padding: '1rem', background: 'rgba(255,204,0,0.1)', borderRadius: '8px' }}>
                        No animation videos found for: "{processedWords.join(', ')}".
                        <br />
                        Trying character fallback...
                    </div>
                )}
            </div>

            {/* Animation Output */}
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <AnimationPlayer
                    animations={animations}
                    words={processedWords}
                />
            </div>
        </div>
    );
};
// Add keyframes for spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

export default SpeechToSign;
