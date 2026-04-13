import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, ChevronRight, Play } from 'lucide-react';
import { LEARNING_LEVELS } from '../../data/learnData';
import { useLearnProgress } from '../../hooks/useLearnProgress';

const LevelCard = ({ level, isUnlocked, isSelected, onClick, progress, onBack }) => {
    
    // Calculate how many sub-levels are completed for this level
    const completedCount = level.subLevels.filter(sl => progress.completedSubLevels.includes(sl.id)).length;
    const isCompleted = completedCount === level.subLevels.length;

    if (isSelected) return null; // We render the expanded state differently in the parent

    return (
        <motion.div
            layoutId={`level-card-${level.id}`}
            whileHover={isUnlocked ? { scale: 1.02, y: -4 } : {}}
            whileTap={isUnlocked ? { scale: 0.98 } : {}}
            onClick={() => isUnlocked && onClick(level)}
            className={`
                relative overflow-hidden rounded-2xl border transition-all duration-300
                ${isUnlocked 
                    ? 'bg-white/5 backdrop-blur-xl border-white/10 hover:border-primary/50 cursor-pointer shadow-lg hover:shadow-primary/20' 
                    : 'bg-white/5 border-white/5 opacity-60 cursor-not-allowed grayscale-[0.5]'}
            `}
        >
            <div className="p-6 h-full flex flex-col relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl">
                        {level.icon}
                    </div>
                    {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                    ) : (
                        <div className="text-sm font-bold opacity-50">Lvl {level.id}</div>
                    )}
                </div>

                <h3 className={`text-xl font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                    {level.title}
                </h3>
                
                <p className="text-sm text-gray-400 mb-6 flex-grow">
                    {level.description}
                </p>

                <div className="mt-auto">
                    {!isUnlocked ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-black/20 p-2 rounded-lg">
                            <Lock className="w-4 h-4" />
                            <span>Unlocks at {level.requiredXP} XP</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between text-sm">
                            <div className="text-gray-400">
                                {completedCount}/{level.subLevels.length} completed
                            </div>
                            <div className="bg-primary/20 text-primary p-2 rounded-full">
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Subtle background glow for completed levels */}
            {isCompleted && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
            )}
        </motion.div>
    );
};

export const LevelMap = ({ onSelectLevel, selectedLevel, onBack }) => {
    const { progress, isLevelUnlocked } = useLearnProgress();

    if (selectedLevel) {
        return null; // Don't render the grid if a level is selected
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-8 p-6 bg-gradient-to-br from-primary/20 to-purple-500/10 border border-primary/20 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Your Journey</h2>
                    <p className="text-gray-400">Master basics before moving to advanced conversation.</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Total XP</div>
                    <div className="text-3xl font-bold text-primary">{progress.xp}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {LEARNING_LEVELS.map((level) => (
                    <LevelCard 
                        key={level.id} 
                        level={level} 
                        isUnlocked={isLevelUnlocked(level.requiredXP)}
                        isSelected={selectedLevel?.id === level.id}
                        onClick={onSelectLevel}
                        progress={progress}
                        onBack={onBack}
                    />
                ))}
            </div>
        </div>
    );
};
