import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useLearnProgress } from '../../hooks/useLearnProgress';

export const LearnMode = ({ level, onComplete }) => {
    const { addSignLearned } = useLearnProgress();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [completed, setCompleted] = useState(false);

    const signs = level.signs;
    const currentSign = signs[currentIndex];

    // Placeholder until we have actual image/gif assets
    const renderSignVisual = (signChar) => {
        return (
            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-primary/10 border-4 border-primary/20 flex flex-col items-center justify-center text-7xl mb-8 relative">
                 <span className="opacity-80">🖐️</span>
                 <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-ping opacity-20"></div>
                 <div className="absolute -bottom-4 bg-primary text-white text-xl font-bold px-6 py-2 rounded-xl shadow-lg border border-primary-strong">
                    "{signChar}"
                 </div>
            </div>
        );
    };

    const handleNext = () => {
        addSignLearned(currentSign.sign);
        if (currentIndex < signs.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setCompleted(true);
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    if (completed) {
         return (
             <div className="flex flex-col items-center justify-center flex-grow bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center animate-fade-in">
                 <CheckCircle2 className="w-20 h-20 text-green-400 mb-6" />
                 <h2 className="text-3xl font-bold text-white mb-2">Great Job!</h2>
                 <p className="text-gray-400 mb-8">You've reviewed all the signs in this sub-level.</p>
             </div>
         );
    }

    return (
        <div className="flex flex-col items-center justify-center flex-grow bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 sm:p-8 relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / signs.length) * 100}%` }}
                />
            </div>
            
            <div className="absolute top-4 right-6 text-sm font-bold text-gray-500 bg-white/5 px-3 py-1 rounded-lg">
                {currentIndex + 1} / {signs.length}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center text-center w-full max-w-lg"
                >
                    {renderSignVisual(currentSign.sign)}

                    <h2 className="text-4xl font-bold text-white mb-4">
                        Sign: {currentSign.sign}
                    </h2>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 text-blue-100 p-6 rounded-2xl w-full text-lg shadow-inner">
                        <span className="block text-sm text-blue-400/80 uppercase tracking-widest font-bold mb-2">How to sign it</span>
                        {currentSign.hint}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-4 mt-12 w-full max-w-sm justify-between">
                <button 
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`p-4 rounded-xl flex items-center justify-center transition-all ${currentIndex === 0 ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                    onClick={handleNext}
                    className="flex-grow py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-all text-lg"
                >
                    {currentIndex === signs.length - 1 ? 'Finish' : 'Next Sign'}
                    {currentIndex !== signs.length - 1 && <ChevronRight className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};
