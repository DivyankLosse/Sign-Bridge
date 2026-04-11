import React, { useRef, useEffect } from 'react';
import { MessageSquare, Copy } from 'lucide-react';

const TranscriptPanel = ({ entries }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [entries]);

    const copyTranscript = () => {
        const text = entries.map(e => e.text).join(' ');
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col flex-grow overflow-hidden shadow-lg h-full max-h-[300px]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center shrink-0 bg-white/5">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Session Transcript
                </h3>
                <button 
                    onClick={copyTranscript}
                    className="text-gray-400 hover:text-white p-1 transition-colors"
                    title="Copy full text"
                >
                    <Copy className="w-4 h-4" />
                </button>
            </div>
            
            <div 
                ref={scrollRef}
                className="flex-grow p-4 overflow-y-auto space-y-3 custom-scrollbar"
            >
                {entries.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                        No translations recorded yet
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {entries.map((entry, idx) => (
                            <span 
                                key={idx} 
                                className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary-light rounded-lg text-sm animate-scale-in"
                                title={`Conf: ${(entry.confidence * 100).toFixed(0)}%`}
                            >
                                {entry.text}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            {entries.length > 0 && (
                <div className="p-3 border-t border-white/10 bg-black/20 shrink-0">
                    <p className="text-gray-300 font-medium leading-relaxed">
                        {entries.map(e => e.text).join(' ')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default React.memo(TranscriptPanel);
