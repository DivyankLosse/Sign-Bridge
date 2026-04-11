import React, { useState, useEffect } from 'react';
import Camera from '../components/Camera';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Game = () => {
    const navigate = useNavigate();
    const [targetLetter, setTargetLetter] = useState('');
    const [score, setScore] = useState(0);
    const [gameStatus, setGameStatus] = useState('idle'); // idle, playing, success, fail
    const [timeLeft, setTimeLeft] = useState(30);

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const startNewRound = () => {
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        setTargetLetter(randomLetter);
        setGameStatus('playing');
        setTimeLeft(30);
    };

    useEffect(() => {
        startNewRound();
    }, []);

    useEffect(() => {
        if (gameStatus === 'playing' && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && gameStatus === 'playing') {
            setGameStatus('fail');
        }
    }, [timeLeft, gameStatus]);

    // This callback will be passed to Camera to receive real-time predictions
    const handlePrediction = (prediction, confidence) => {
        if (gameStatus === 'playing' && prediction === targetLetter && confidence > 0.85) {
            setGameStatus('success');
            setScore(s => s + 10);
            // Auto-advance after a brief pause
            setTimeout(startNewRound, 2000);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/')} className="secondary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={20} /> Exit
                </button>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    Score: {score}
                </div>
            </div>

            {/* Game Area */}
            <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '2rem' }}>
                    Sign the letter: <span style={{ color: 'var(--primary)', fontSize: '3rem' }}>{targetLetter}</span>
                </h2>

                <div style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: timeLeft < 10 ? 'var(--accent-red)' : 'var(--text-secondary)' }}>
                    Time Remaining: {timeLeft}s
                </div>

                {/* Camera Component Wrapper */}
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '4px solid var(--surface)', display: 'inline-block' }}>
                    {/* passing a prop to Camera would be ideal, but for now we might need to modify Camera.jsx to accept a callback. 
                        I'll assume I need to modify Camera.jsx next. 
                    */}
                    <Camera onPrediction={handlePrediction} />
                </div>

                {/* Status Feedback */}
                {gameStatus === 'success' && (
                    <div style={{ marginTop: '20px', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        <CheckCircle size={32} /> Correct! Next round...
                    </div>
                )}
                {gameStatus === 'fail' && (
                    <div style={{ marginTop: '20px', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        <XCircle size={32} /> Time's up!
                    </div>
                )}
                {gameStatus === 'fail' && (
                    <button className="primary-btn" onClick={startNewRound} style={{ marginTop: '1rem' }}>
                        <RefreshCw size={18} style={{ marginRight: '8px' }} /> Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default Game;
