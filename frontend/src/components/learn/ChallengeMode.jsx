import React, { useState, useEffect, useRef } from 'react';
import { CameraTrainer } from './CameraTrainer';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer } from 'lucide-react';
import { useLearnTranscript } from '../../hooks/useLearnTranscript';

export const ChallengeMode = ({ level, subLevel, onComplete }) => {
    // Generate a random order of 10 signs (can have duplicates if level has few signs)
    const [challengeQueue, setChallengeQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds
    const [streak, setStreak] = useState(0);
    const [score, setScore] = useState(0);
    const [isSuccessState, setIsSuccessState] = useState(false);
    
    const { logActivity } = useLearnTranscript();
    const timerRef = useRef(null);

    useEffect(() => {
        // Initialize queue
        const q = [];
        for(let i=0; i<10; i++) {
            const randomSign = level.signs[Math.floor(Math.random() * level.signs.length)];
            q.push(randomSign);
        }
        setChallengeQueue(q);

        timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [level]);

    useEffect(() => {
        if (timeRemaining === 0) {
            onComplete(Math.min(100, score), streak);
        }
    }, [timeRemaining, score, streak, onComplete]);


    if (challengeQueue.length === 0) return null;
    const currentSign = challengeQueue[currentIndex];

    const handleStablePrediction = (pred, conf) => {
        if (pred === currentSign.sign && !isSuccessState && timeRemaining > 0) {
            setIsSuccessState(true);
            const newStreak = streak + 1;
            setStreak(newStreak);
            
            // Base points + streak multiplier
            let points = 10;
            if (newStreak >= 3) points = 20;
            if (newStreak >= 5) points = 30;
            if (newStreak >= 10) points = 50;
            
            setScore(prev => prev + points);

            logActivity({
                 source: "learn",
                 mode: "challenge",
                 sign: currentSign.sign,
                 result: "correct",
                 confidence: conf,
                 level: level.id,
                 subLevel: subLevel.id
             });

            setTimeout(() => {
                 setIsSuccessState(false);
                 if (currentIndex < challengeQueue.length - 1) {
                     setCurrentIndex(prev => prev + 1);
                 } else {
                     clearInterval(timerRef.current);
                     onComplete(Math.min(100, score + 20), newStreak); // Bonus for finishing all
                 }
            }, 800);
        } else if (pred !== currentSign.sign) {
             setStreak(0); // Break streak on wrong stable prediction
        }
    };

    return (
        <div className="flex flex-col h-full flex-grow relative p-6">
            <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider text-sm bg-red-500/10 px-4 py-1.5 rounded-full">
                         <Timer className="w-4 h-4" />
                         {timeRemaining}s
                     </div>
                     <div className="text-xl font-bold text-white">Score: {score}</div>
                 </div>

                 <AnimatePresence>
                     {streak >= 3 && (
                         <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="flex items-center gap-1 text-orange-400 font-bold bg-orange-500/20 px-3 py-1 rounded-lg"
                        >
                             <Zap className="w-5 h-5 fill-current animate-pulse" />
                             {streak}x Streak!
                         </motion.div>
                     )}
                 </AnimatePresence>
            </div>

            <div className="text-center mb-8">
                <div className="text-sm text-gray-500 mb-2">Prepare next: {challengeQueue[currentIndex+1]?.sign || 'Finish line'}</div>
                <h2 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 drop-shadow-lg">
                    {currentSign.sign}
                </h2>
            </div>

            <div className="flex-grow w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)] relative border border-red-500/20">
                <CameraTrainer 
                    isActive={!isSuccessState && timeRemaining > 0} 
                    fps={5}
                    expectedSign={currentSign.sign}
                    onStablePrediction={handleStablePrediction}
                    confidenceThreshold={0.7}
                />

                <AnimatePresence>
                    {isSuccessState && (
                        <motion.div 
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="absolute inset-0 bg-red-500/80 backdrop-blur-md z-40 flex flex-col items-center justify-center text-white"
                        >
                            <Zap className="w-24 h-24 mb-4 fill-white" />
                            <h3 className="text-4xl font-black italic">FAST!</h3>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
