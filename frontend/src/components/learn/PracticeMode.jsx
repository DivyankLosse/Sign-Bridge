import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CameraTrainer } from './CameraTrainer';
import { Check, Info } from 'lucide-react';

const AUTO_ADVANCE_DELAY_MS = 900;

export const PracticeMode = ({ level, onComplete }) => {
    const signs = level.signs;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMatched, setIsMatched] = useState(false);
    const advanceTimeoutRef = useRef(null);
    const currentSign = signs[currentIndex];

    const clearAdvanceTimeout = useCallback(() => {
        if (advanceTimeoutRef.current) {
            clearTimeout(advanceTimeoutRef.current);
            advanceTimeoutRef.current = null;
        }
    }, []);

    const handleNext = useCallback(() => {
        clearAdvanceTimeout();

        if (currentIndex < signs.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsMatched(false);
        } else {
            onComplete();
        }
    }, [clearAdvanceTimeout, currentIndex, onComplete, signs.length]);

    const handleStablePrediction = (pred) => {
        if (pred === currentSign.sign) {
             setIsMatched(true);
             if (!advanceTimeoutRef.current) {
                advanceTimeoutRef.current = setTimeout(() => {
                    handleNext();
                }, AUTO_ADVANCE_DELAY_MS);
             }
        }
    };

    useEffect(() => () => clearAdvanceTimeout(), [clearAdvanceTimeout]);

    return (
        <div className="flex flex-col h-full flex-grow relative">
             {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5 rounded-t-2xl overflow-hidden z-10">
                <div 
                    className="h-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${((currentIndex) / signs.length) * 100}%` }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full flex-grow p-6">
                
                {/* Info Panel */}
                <div className="col-span-1 flex flex-col justify-center bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                    <div className="mb-4 text-purple-400 font-bold uppercase tracking-wider text-sm flex items-center justify-between">
                        <span>Practice Mode</span>
                        <span>{currentIndex + 1} / {signs.length}</span>
                    </div>
                    
                    <h2 className="text-5xl font-bold text-white mb-6">
                        {currentSign.sign}
                    </h2>

                    <div className="bg-purple-500/10 border border-purple-500/20 text-purple-100 p-4 rounded-xl mb-6 flex items-start gap-3">
                        <Info className="w-5 h-5 mt-0.5 shrink-0" />
                        <span className="text-sm shadow-inner">{currentSign.hint}</span>
                    </div>

                    <button 
                        onClick={handleNext}
                        className="mt-auto py-3 w-full bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
                    >
                        {currentIndex === signs.length - 1 ? 'Finish Practice' : 'Skip / Next'}
                        {isMatched && <Check className="w-4 h-4 text-green-400" />}
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-4 text-center">
                        Try copying the sign until the AI recognizes it. Correct signs move ahead automatically.
                    </p>
                </div>

                {/* Camera View */}
                <div className="col-span-1 md:col-span-2 h-[400px] md:h-auto rounded-2xl overflow-hidden relative">
                     <CameraTrainer 
                         isActive={true} 
                         fps={5}
                         onStablePrediction={handleStablePrediction}
                         onRawPrediction={(data) => {
                            if (data.prediction !== currentSign.sign) {
                                setIsMatched(false);
                            }
                         }}
                     />

                     {/* Success Indicator Overlay */}
                     <div
                        className={`absolute top-4 right-4 bg-green-500/20 backdrop-blur-md border border-green-500 text-green-400 px-4 py-2 rounded-xl flex items-center gap-2 font-bold pointer-events-none transition-all duration-200 ${
                            isMatched ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                     >
                         <Check className="w-5 h-5" />
                         Match! Moving on...
                     </div>
                </div>
            </div>
        </div>
    );
};
