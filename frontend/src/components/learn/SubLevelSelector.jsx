import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Camera, Crosshair, Zap, Lock, CheckCircle2 } from 'lucide-react';
import { useLearnProgress } from '../../hooks/useLearnProgress';

const ICONS = {
    "learn": <BookOpen className="w-6 h-6" />,
    "practice": <Camera className="w-6 h-6" />,
    "test": <Crosshair className="w-6 h-6" />,
    "challenge": <Zap className="w-6 h-6" />
};

const THEMES = {
    "learn": "from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30",
    "practice": "from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30",
    "test": "from-orange-500/20 to-orange-600/5 text-orange-400 border-orange-500/30",
    "challenge": "from-red-500/20 to-red-600/5 text-red-400 border-red-500/30",
};

export const SubLevelSelector = ({ level, onBack, onStartSubLevel }) => {
    const { progress, isSubLevelUnlocked } = useLearnProgress();

    if (!level) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl mx-auto"
        >
            <button 
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-2 px-4 rounded-xl hover:bg-white/5"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Map
            </button>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl">{level.icon}</span>
                    <h1 className="text-3xl font-bold text-white">Level {level.id}: {level.title}</h1>
                </div>
                <p className="text-gray-400 text-lg mb-8 ml-14">{level.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {level.subLevels.map((subLevel, index) => {
                        const isUnlocked = isSubLevelUnlocked(subLevel.id);
                        const isCompleted = progress.completedSubLevels.includes(subLevel.id);
                        const isAI = subLevel.type === "test" || subLevel.type === "challenge";

                        return (
                            <motion.button
                                key={subLevel.id}
                                whileHover={isUnlocked ? { scale: 1.02 } : {}}
                                whileTap={isUnlocked ? { scale: 0.98 } : {}}
                                onClick={() => isUnlocked && onStartSubLevel(level, subLevel)}
                                className={`
                                    flex flex-col items-start p-6 rounded-2xl border text-left transition-all duration-300
                                    ${isUnlocked 
                                        ? `bg-gradient-to-br ${THEMES[subLevel.type]} hover:shadow-lg shadow-black/20` 
                                        : 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed grayscale'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-start w-full mb-4">
                                    <div className="p-3 bg-white/10 rounded-xl">
                                        {ICONS[subLevel.type]}
                                    </div>
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                                    ) : !isUnlocked ? (
                                        <Lock className="w-5 h-5 text-gray-500" />
                                    ) : null}
                                </div>
                                
                                <h3 className={`text-xl font-bold mb-1 ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                                    {index + 1}. {subLevel.title}
                                </h3>
                                
                                {isAI && isUnlocked && (
                                    <span className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-black/30 border border-white/10 text-gray-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                        AI Required
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};
