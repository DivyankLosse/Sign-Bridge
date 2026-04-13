import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Star, Trophy } from 'lucide-react';

export const FeedbackPanel = ({ score, xpGained, streak, onClose }) => {
    useEffect(() => {
        if (score >= 80) {
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#8b5cf6', '#3b82f6', '#10b981']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#8b5cf6', '#3b82f6', '#10b981']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [score]);

    const stars = score >= 90 ? 3 : score >= 50 ? 2 : 1;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <div className="bg-surface border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />

                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <Trophy className="w-10 h-10 text-primary" />
                    {streak > 0 && (
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-surface">
                            {streak}x
                        </div>
                    )}
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">Level Complete!</h2>
                
                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3].map(i => (
                        <motion.div 
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.2, type: "spring" }}
                        >
                            <Star className={`w-10 h-10 ${i <= stars ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <div className="text-gray-400 text-sm mb-1 uppercase font-bold tracking-wider">Score</div>
                        <div className="text-2xl font-bold text-white">{score}</div>
                    </div>
                    <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
                        <div className="text-primary text-sm mb-1 uppercase font-bold tracking-wider">XP Gained</div>
                        <div className="text-2xl font-bold text-primary">+{xpGained}</div>
                    </div>
                </div>

                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all"
                >
                    Continue Journey
                </button>
            </div>
        </motion.div>
    );
};
