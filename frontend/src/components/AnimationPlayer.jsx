import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCw, SkipForward } from 'lucide-react';
import { API_BASE_URL } from '../utils/constants';

const AnimationPlayer = ({ animations, words, onComplete }) => {
    const videoRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState(false);

    // Reset when animations list changes
    useEffect(() => {
        setCurrentIndex(0);
        setIsPlaying(true); // Auto-play when new sequence arrives
        setError(false);
    }, [animations]);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(e => {
                    console.error("Autoplay prevented:", e);
                    setIsPlaying(false);
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [currentIndex, isPlaying, animations]);

    const handleVideoEnd = () => {
        if (currentIndex < animations.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsPlaying(false);
            if (onComplete) onComplete();
        }
    };

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleReplay = () => {
        setCurrentIndex(0);
        setIsPlaying(true);
    };

    const handleNext = () => {
        if (currentIndex < animations.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    if (!animations || animations.length === 0) {
        return (
            <div style={{
                height: '350px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)'
            }}>
                <Play size={48} opacity={0.5} style={{ marginBottom: '1rem' }} />
                <p>Waiting for speech input...</p>
            </div>
        );
    }

    // Correctly format URL if it's relative
    const currentVideoSrc = animations[currentIndex].startsWith('http')
        ? animations[currentIndex]
        : `${API_BASE_URL}${animations[currentIndex]}`;

    return (
        <div className="animation-player" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Video Container */}
            <div style={{
                position: 'relative',
                background: '#000',
                borderRadius: '12px',
                overflow: 'hidden',
                aspectRatio: '16/9',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
                {!error ? (
                    <video
                        ref={videoRef}
                        src={currentVideoSrc}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onEnded={handleVideoEnd}
                        onError={(e) => {
                            console.error("Video load error:", e);
                            setError(true);
                        }}
                        playsInline
                        muted // Important for autoplay policy
                        autoPlay
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--error-red)', gap: '0.5rem'
                    }}>
                        <span className="material-symbols-outlined text-4xl">broken_image</span>
                        <p>Video not found</p>
                        <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{currentVideoSrc}</span>
                    </div>
                )}

                {/* Overlay Controls */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '1rem',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                    <button onClick={handlePlayPause} className="icon-btn" style={{ color: 'white' }}>
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>

                    <button onClick={handleReplay} className="icon-btn" style={{ color: 'white' }}>
                        <RotateCw size={20} />
                    </button>

                    <span style={{ color: 'white', fontSize: '0.9rem', flex: 1 }}>
                        {currentIndex + 1} / {animations.length}
                    </span>

                    <button onClick={handleNext} className="icon-btn" style={{ color: 'white' }} disabled={currentIndex >= animations.length - 1}>
                        <SkipForward size={20} />
                    </button>
                </div>
            </div>

            {/* Current Word Display */}
            <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                textAlign: 'center'
            }}>
                <h3 style={{
                    fontSize: '1.5rem',
                    color: 'var(--accent-purple)',
                    marginBottom: '0.5rem'
                }}>
                    {words[currentIndex] || "..."}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Current Sign
                </p>
            </div>

            {/* Word Sequence */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                justifyContent: 'center'
            }}>
                {words.map((word, idx) => (
                    <span key={idx} style={{
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '0.85rem',
                        background: idx === currentIndex ? 'var(--accent-purple)' : 'rgba(255,255,255,0.1)',
                        color: idx === currentIndex ? 'white' : 'var(--text-secondary)',
                        transition: 'all 0.2s',
                        opacity: idx > currentIndex ? 0.5 : 1
                    }}>
                        {word}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AnimationPlayer;
