import React, { useState } from 'react';
import { LevelMap } from '../components/learn/LevelMap';
import { SubLevelSelector } from '../components/learn/SubLevelSelector';
import { SubLevelEngine } from '../components/learn/SubLevelEngine';
import { Flame } from 'lucide-react';
import { useLearnProgress } from '../hooks/useLearnProgress';

const ProgressTracker = () => {
    const { progress } = useLearnProgress();
    const nextRank = Math.floor(progress.xp / 500) * 500 + 500;
    const progressPercent = Math.min(100, Math.round((progress.xp % 500) / 500 * 100));

    return (
        <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 mb-8 w-full">
            <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                <div className={`p-2 rounded-xl flex items-center justify-center ${progress.dailyStreak.count > 0 ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-800 text-gray-500'}`}>
                    <Flame className="w-6 h-6" />
                </div>
                <div>
                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Daily Streak</div>
                    <div className="font-bold text-white">{progress.dailyStreak.count || 0} {progress.dailyStreak.count === 1 ? 'Day' : 'Days'}</div>
                </div>
            </div>

            <div className="flex-grow">
                 <div className="flex justify-between items-end mb-2">
                     <span className="text-sm font-medium text-white">Rank Progress</span>
                     <span className="text-xs text-gray-400">{progress.xp} / {nextRank} XP</span>
                 </div>
                 <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-gradient-to-r from-primary to-tertiary transition-all duration-1000 ease-out" 
                        style={{ width: `${progressPercent}%` }}
                    />
                 </div>
            </div>
            
            <div className="pl-6 border-l border-white/10">
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold text-right">Signs Learned</div>
                <div className="font-bold text-white text-right text-xl">{progress.signsLearned.length}</div>
            </div>
        </div>
    );
};

const LearnPage = () => {
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [activeSubLevel, setActiveSubLevel] = useState(null); // Will hold { level, subLevel }

    const handleLevelSelect = (level) => {
        setSelectedLevel(level);
    };

    const handleBackToMap = () => {
        setSelectedLevel(null);
        setActiveSubLevel(null);
    };

    const handleStartSubLevel = (level, subLevel) => {
        setActiveSubLevel({ level, subLevel });
    };

    const handleCompleteSubLevel = () => {
        // Triggered when a sub-level finishes
        setActiveSubLevel(null);
        // Keep selectedLevel so user returns to the sub-level selection screen
    };

    return (
        <div className="p-8 max-w-7xl mx-auto h-full min-h-screen">
            <header className="mb-6">
                <h1 className="text-4xl font-bold text-white mb-2">Learn ASL</h1>
                <p className="text-gray-400 text-lg">Master sign language step-by-step with interactive AI.</p>
            </header>

            {!activeSubLevel && <ProgressTracker />}

            {/* View Dispatcher */}
            {activeSubLevel ? (
                <SubLevelEngine 
                    level={activeSubLevel.level} 
                    subLevel={activeSubLevel.subLevel} 
                    onBack={() => setActiveSubLevel(null)} 
                    onComplete={handleCompleteSubLevel} 
                />
            ) : selectedLevel ? (
                <SubLevelSelector 
                    level={selectedLevel} 
                    onBack={handleBackToMap} 
                    onStartSubLevel={handleStartSubLevel} 
                />
            ) : (
                <LevelMap 
                    onSelectLevel={handleLevelSelect} 
                    selectedLevel={selectedLevel} 
                />
            )}
        </div>
    );
};

export default LearnPage;
