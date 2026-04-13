import React from 'react';
import { Activity } from 'lucide-react';

const PredictionDisplay = ({ data, useNlp }) => {
    const raw = data?.raw_prediction || "";
    const corrected = data?.corrected_prediction || "";
    const confidence = data?.confidence || 0;
    const isDetected = !!raw;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shrink-0 shadow-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-2">
                    Current Sign
                    {isDetected && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            data.mode === 'word' 
                            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        }`}>
                            {data.mode === 'word' ? 'WLASL WORD' : 'ASL SPELL'}
                        </span>
                    )}
                </div>
                {isDetected && (
                    <span className="flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded border border-white/5">
                        <Activity className="w-3 h-3 text-primary" />
                        Conf: {(confidence * 100).toFixed(0)}%
                    </span>
                )}
            </h3>

            <div className="mb-4 min-h-[4rem] flex items-center">
                {isDetected ? (
                    <div className="w-full">
                        <div className="text-4xl font-bold text-white mb-2 tracking-tight animate-fade-in">
                            {useNlp ? corrected : raw}
                        </div>
                        {useNlp && raw !== corrected && (
                            <div className="text-sm text-gray-500 flex items-center gap-1 font-mono">
                                <span className="text-gray-400">Raw:</span> {raw}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-gray-600 text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined animate-pulse">sign_language</span>
                        Waiting for gesture...
                    </div>
                )}
            </div>

            {/* Confidence Bar */}
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-primary to-purple-400 transition-all duration-300 ease-out" 
                    style={{ width: `${confidence * 100}%` }}
                ></div>
            </div>
        </div>
    );
};

export default PredictionDisplay;
