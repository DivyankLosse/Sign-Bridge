import React from 'react';
import TopNavbar from '../components/TopNavbar';

const Translator = () => {
    return (
        <>
            <TopNavbar title="Translator" />
            <div className="flex-1 p-8 grid grid-cols-12 gap-8 overflow-y-auto">
                {/* Left Side: Webcam Feed */}
                <div className="col-span-12 lg:col-span-7 flex flex-col space-y-6">
                    <div className="relative glass-panel rounded-lg overflow-hidden active-glow flex-1 min-h-[500px]">
                        {/* Live Feed Container */}
                        <div className="absolute inset-0 bg-black/40">
                            <img alt="Webcam Feed" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-r3sPUz5BL0syopwCiCAwComWe17tGAZ6tsNPETQ7LOuAuhXYU8pamkRZHJ7d7TAIVlspRIGal9rLLuvlkGSUj5VLIrXw_Z9A8ks1xR3BQ0IDmxsHMRrVTfgSyleUlPpZw_ScAEEMoGlsRTdqu611t-YkhLG5RO9_7q_xOVjxBDoI2fKifsV34Uh2D4njBcGRzFpqUzt8L9uTRu758sQRwv-__i_Oa0xw_wO2wNF_XUY8qsrSuKjW0Nx5b66_OqDGBwDvYvRBlbsK"/>
                            {/* HUD Elements */}
                            <div className="absolute top-6 left-6 flex items-center space-x-3">
                                <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-full">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live</span>
                                </div>
                                <div className="px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">ASL (American Sign Language)</span>
                                </div>
                            </div>
                            {/* Gesture Tracking Overlay (Mock) */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 800 600">
                                <circle cx="400" cy="300" fill="#d0bcff" r="4"></circle>
                                <path d="M380 280 L400 300 L420 280" fill="none" stroke="#d0bcff" strokeWidth="2"></path>
                                <circle cx="350" cy="350" fill="#c0c1ff" r="3"></circle>
                                <circle cx="450" cy="350" fill="#c0c1ff" r="3"></circle>
                            </svg>
                        </div>
                        {/* Camera Controls */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4">
                            <button className="w-14 h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/10 transition-all scale-95 active:scale-90">
                                <span className="material-symbols-outlined">videocam_off</span>
                            </button>
                            <button className="h-14 px-8 rounded-full bg-red-500/80 hover:bg-red-500 text-white font-bold flex items-center space-x-2 transition-all shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                                <span className="material-symbols-outlined">stop_circle</span>
                                <span>Stop Stream</span>
                            </button>
                            <button className="w-14 h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/10 transition-all scale-95 active:scale-90">
                                <span className="material-symbols-outlined">mic</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Output Panel */}
                <div className="col-span-12 lg:col-span-5 flex flex-col space-y-6">
                    <div className="glass-panel p-8 rounded-lg flex-1 flex flex-col space-y-8 relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] text-on-surface-variant/50 uppercase font-bold tracking-[0.2em]">Predicted Text</span>
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] text-on-surface-variant/50 uppercase font-bold tracking-widest">Confidence</span>
                                    <span className="text-primary font-bold text-sm">98.4%</span>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                <div className="h-full primary-gradient w-[98.4%] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]"></div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col">
                            <div className="text-5xl font-black text-on-surface font-headline leading-tight tracking-tighter">
                                "Hello, how can I help you today?"
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                <span className="text-[10px] text-on-surface-variant/50 uppercase font-bold tracking-widest block">Live Stream Transcript</span>
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                    <div className="flex items-start space-x-3 opacity-40 hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-mono text-primary/60 mt-1">12:45:01</span>
                                        <p className="text-sm font-medium">Excuse me</p>
                                    </div>
                                    <div className="flex items-start space-x-3 opacity-60 hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-mono text-primary/60 mt-1">12:45:04</span>
                                        <p className="text-sm font-medium">I am looking for the main hall</p>
                                    </div>
                                    <div className="flex items-start space-x-3 bg-primary/5 p-3 rounded-xl border-l-2 border-primary">
                                        <span className="text-[10px] font-mono text-primary mt-1">12:45:15</span>
                                        <p className="text-sm font-bold text-on-surface">Hello, how can I help you today?</p>
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse ml-auto mt-1"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className="flex-1 py-4 glass-panel rounded-full text-xs font-bold flex items-center justify-center space-x-2 hover:bg-white/10 transition-all">
                                <span className="material-symbols-outlined text-sm">content_copy</span>
                                <span>Copy Text</span>
                            </button>
                            <button className="flex-1 py-4 glass-panel rounded-full text-xs font-bold flex items-center justify-center space-x-2 hover:bg-white/10 transition-all">
                                <span className="material-symbols-outlined text-sm">volume_up</span>
                                <span>Text to Speech</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Translator;
