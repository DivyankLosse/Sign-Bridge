import React from 'react';

const RecognitionOverlay = ({ active }) => {
    return (
        <div className="absolute inset-0 pointer-events-none w-full h-full">
            {/* Visual borders when hand is detected */}
            <div className={`absolute inset-4 border-2 border-primary/40 rounded-xl transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}>
                {/* Corner accents */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
            </div>
            
            {/* Scanning line animation */}
            {active && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.8)] animate-scan"></div>
            )}
        </div>
    );
};

export default RecognitionOverlay;
