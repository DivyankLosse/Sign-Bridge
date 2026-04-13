import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { LearnMode } from './LearnMode';
import { PracticeMode } from './PracticeMode';
import { TestMode } from './TestMode';
import { ChallengeMode } from './ChallengeMode';
import { FeedbackPanel } from './FeedbackPanel';
import { useLearnProgress } from '../../hooks/useLearnProgress';

export const SubLevelEngine = ({ level, subLevel, onBack, onComplete }) => {
    const { completeSubLevel } = useLearnProgress();
    const [isFinished, setIsFinished] = useState(false);
    const [completionData, setCompletionData] = useState(null);

    const handleSubLevelComplete = (score = 100, xpEarned = 10, streak = 0) => {
        completeSubLevel(subLevel.id, score, xpEarned);
        setCompletionData({ score, xpEarned, streak });
        setIsFinished(true);
    };

    const handleFeedbackClose = () => {
         onComplete();
    };

    if (isFinished && completionData) {
        return <FeedbackPanel 
                  score={completionData.score} 
                  xpGained={completionData.xpEarned} 
                  streak={completionData.streak} 
                  onClose={handleFeedbackClose} 
               />;
    }

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full min-h-[600px]">
            <header className="flex items-center justify-between mb-6 shrink-0">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-2 px-4 rounded-xl hover:bg-white/5"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Exit {subLevel.title}
                </button>
                <div className="text-right">
                    <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">{level.title}</div>
                    <div className="text-lg text-white font-medium">{subLevel.title}</div>
                </div>
            </header>

            <div className="flex-grow flex flex-col relative w-full h-full">
                {subLevel.type === 'learn' && (
                    <LearnMode level={level} onComplete={() => handleSubLevelComplete(100, 5)} />
                )}
                {subLevel.type === 'practice' && (
                    <PracticeMode level={level} onComplete={() => handleSubLevelComplete(100, 10)} />
                )}
                {subLevel.type === 'test' && (
                    <TestMode level={level} subLevel={subLevel} onComplete={(score) => handleSubLevelComplete(score, Math.round(15 * (score/100)))} />
                )}
                {subLevel.type === 'challenge' && (
                    <ChallengeMode level={level} subLevel={subLevel} onComplete={(score, streak) => handleSubLevelComplete(score, 20 + streak * 5)} />
                )}
            </div>
        </div>
    );
};
