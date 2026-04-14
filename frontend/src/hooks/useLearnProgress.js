import { useState, useEffect } from 'react';

const STORAGE_KEY = 'signbridge_learn_progress';

const DEFAULT_STATE = {
  currentLevel: 1,
  xp: 0,
  streak: 0,
  dailyStreak: { lastDate: null, count: 0 },
  completedSubLevels: [],
  levelScores: {},
  signsLearned: [],
  lastPlayed: null
};

export const useLearnProgress = () => {
  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_STATE, ...JSON.parse(stored) };
      }
    } catch {
      // Fall back to defaults if persisted progress is malformed.
    }
    return DEFAULT_STATE;
  });

  // Save to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Handle daily streak on initial hook load/mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress((prev) => {
      if (prev.dailyStreak.lastDate === today) {
        return prev;
      }

      let newCount = prev.dailyStreak.count;
      const lastDate = prev.dailyStreak.lastDate;

      if (lastDate) {
        const last = new Date(lastDate);
        const current = new Date(today);
        const diffTime = Math.abs(current - last);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newCount += 1;
        } else if (diffDays > 1) {
          newCount = 1;
        }
      } else {
        newCount = 1;
      }

      return {
        ...prev,
        dailyStreak: { lastDate: today, count: newCount },
        lastPlayed: new Date().toISOString()
      };
    });
  }, []);

  const completeSubLevel = (subLevelId, score = 0, xpEarned = 0) => {
    setProgress(prev => {
        const newCompleted = new Set(prev.completedSubLevels);
        newCompleted.add(subLevelId);
        
        const [levelIdStr] = subLevelId.split('-');
        const currentLevelScore = prev.levelScores[levelIdStr] || 0;

        return {
            ...prev,
            xp: prev.xp + xpEarned,
            completedSubLevels: Array.from(newCompleted),
            levelScores: {
                ...prev.levelScores,
                [levelIdStr]: Math.max(currentLevelScore, score)
            },
            lastPlayed: new Date().toISOString()
        };
    });
  };

  const isSubLevelUnlocked = (subLevelId) => {
    if (subLevelId.endsWith("-1")) return true; // first sub level of any unlocked level is unlocked
    
    // For x-2, check if x-1 is completed
    const parts = subLevelId.split('-');
    const prevSubLevelId = `${parts[0]}-${parseInt(parts[1]) - 1}`;
    
    return progress.completedSubLevels.includes(prevSubLevelId);
  };

  const isLevelUnlocked = (reqXP) => {
    return progress.xp >= reqXP;
  };

  const addSignLearned = (sign) => {
      setProgress(prev => {
          if (!prev.signsLearned.includes(sign)) {
              return {
                  ...prev,
                  signsLearned: [...prev.signsLearned, sign]
              }
          }
          return prev;
      });
  }
  
  const updateStreak = (newStreak) => {
      setProgress(prev => ({ ...prev, streak: newStreak }));
  }

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset all progress? XP and unlocked levels will be lost.")) {
        setProgress(DEFAULT_STATE);
        localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    progress,
    completeSubLevel,
    isSubLevelUnlocked,
    isLevelUnlocked,
    addSignLearned,
    updateStreak,
    resetProgress
  };
};
