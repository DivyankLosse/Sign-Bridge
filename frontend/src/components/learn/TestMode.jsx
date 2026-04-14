import React, { useState } from 'react';
import { CameraTrainer } from './CameraTrainer';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useLearnTranscript } from '../../hooks/useLearnTranscript';

export const TestMode = ({ level, subLevel, onComplete }) => {
    const signs = level.signs;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [, setFails] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [isSuccessState, setIsSuccessState] = useState(false);
    const currentSign = signs[currentIndex];
    
    const { logActivity } = useLearnTranscript();

    // In a real scenario, you'd calculate a score based on time or hints used
    const [scoreAccumulator, setScoreAccumulator] = useState(100);

    const handleStablePrediction = (pred, conf) => {
        if (pred === currentSign.sign) {
             setIsSuccessState(true);
             logActivity({
                 source: "learn",
                 mode: "test",
                 sign: currentSign.sign,
                 result: "correct",
                 confidence: conf,
                 level: level.id,
                 subLevel: subLevel.id
             });

             setTimeout(() => {
                 setIsSuccessState(false);
                 setFails(0);
                 setShowHint(false);

                 if (currentIndex < signs.length - 1) {
                     setCurrentIndex(prev => prev + 1);
                 } else {
                     onComplete(Math.max(10, scoreAccumulator));
                 }
             }, 1500);
        } else {
            // Incorrect prediction that was stable for >1s
            setFails(prev => {
                const newFails = prev + 1;
                if (newFails >= 2) {
                    setShowHint(true);
                    setScoreAccumulator(prevScore => prevScore - 5);
                }
                return newFails;
            });
            logActivity({
                 source: "learn",
                 mode: "test",
                 sign: pred, // What they signed
                 expected: currentSign.sign,
                 result: "incorrect",
                 confidence: conf,
                 level: level.id,
                 subLevel: subLevel.id
             });
        }
    };

    return (
        <div className="flex flex-col h-full flex-grow relative p-6">
            <div className="flex justify-between items-center mb-6">
                 <div className="text-orange-400 font-bold uppercase tracking-wider text-sm">
                     Test Mode: Show me...
                 </div>
                 <div className="text-gray-400 font-medium bg-white/5 px-4 py-1.5 rounded-full">
                     {currentIndex + 1} / {signs.length}
                 </div>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-7xl font-bold text-white tracking-tight">
                    {currentSign.sign}
                </h2>
            </div>

            <div className="flex-grow w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl relative">
                <CameraTrainer 
                    isActive={!isSuccessState} 
                    fps={5}
                    expectedSign={currentSign.sign}
                    onStablePrediction={handleStablePrediction}
                    confidenceThreshold={0.7}
                />

                <AnimatePresence>
                    {isSuccessState && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-green-500/90 backdrop-blur-sm z-40 flex items-center justify-center"
                        >
                            <div className="text-center text-white">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 text-5xl"
                                >
                                    ✓
                                </motion.div>
                                <h3 className="text-3xl font-bold">Perfect!</h3>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showHint && !isSuccessState && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 max-w-2xl mx-auto w-full bg-orange-500/10 border border-orange-500/20 text-orange-200 p-4 rounded-xl flex items-start gap-3"
                    >
                        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-orange-400" />
                        <div>
                            <div className="font-bold text-orange-400 mb-1">Hint Available</div>
                            <div className="text-sm">{currentSign.hint}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
