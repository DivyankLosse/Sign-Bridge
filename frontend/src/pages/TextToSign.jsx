import React, { useState, useRef, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const TextToSign = () => {
    const [text, setText] = useState("");
    const [animations, setAnimations] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handleGenerate = async () => {
        if (!text.trim()) return;
        
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/translate/text`, { text });
            const paths = response.data.animations;
            
            // Map paths to full URLs if needed (backend serves /static)
            const fullUrls = paths.map(p => p.startsWith('http') ? p : `${API_URL}${p}`);
            
            setAnimations(fullUrls);
            setCurrentIndex(0);
            setIsPlaying(true);
        } catch (error) {
            console.error("Translation failed:", error);
            alert("Failed to fetch animations. Please check if backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVideoEnd = () => {
        if (currentIndex < animations.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsPlaying(false);
        }
    };

    return (
        <>
            <TopNavbar title="Text-to-Sign">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20 tracking-wider">v2.4 PRO</span>
            </TopNavbar>
            
            <div className="p-10 max-w-7xl mx-auto w-full space-y-10">
                <section className="relative">
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
                    <div className="glass-panel rounded-lg p-8 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <label className="text-on-surface-variant font-medium text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg">edit_note</span>
                                Enter text to translate to sign language
                            </label>
                        </div>
                        <div className="relative group">
                            <textarea 
                                className="w-full h-48 bg-surface-container-lowest/50 border-none ring-1 ring-outline-variant/20 rounded-lg p-6 text-xl font-medium placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all resize-none" 
                                placeholder="Type a phrase like 'Hello' or 'A B C'..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button 
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="gradient-button text-white font-extrabold px-12 py-5 rounded-full flex items-center gap-3 text-lg hover:shadow-[0_0_30px_rgba(160,120,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            >
                                {isLoading ? "Processing..." : "Generate Signs"}
                                <span className="material-symbols-outlined">rocket_launch</span>
                            </button>
                        </div>
                    </div>
                </section>
                
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-on-surface flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-primary rounded-full"></span>
                            Avatar Representation
                        </h3>
                        {animations.length > 0 && (
                            <span className="text-xs text-on-surface-variant/60">
                                Playing word {currentIndex + 1} of {animations.length}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Video Player */}
                        <div className="flex-1 w-full glass-panel rounded-2xl overflow-hidden aspect-video relative bg-black flex items-center justify-center">
                            {animations.length > 0 ? (
                                <video
                                    key={animations[currentIndex]}
                                    ref={videoRef}
                                    src={animations[currentIndex]}
                                    autoPlay
                                    onEnded={handleVideoEnd}
                                    className="w-full h-full object-contain"
                                    controls={false}
                                />
                            ) : (
                                <div className="text-center space-y-4 text-on-surface-variant/40">
                                    <span className="material-symbols-outlined text-6xl">smart_display</span>
                                    <p>Animation will appear here</p>
                                </div>
                            )}
                            
                            {isPlaying && (
                                <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary transition-all duration-300" 
                                        style={{ width: `${((currentIndex + 1) / animations.length) * 100}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>

                        {/* Sequence List */}
                        <div className="w-full lg:w-80 glass-panel rounded-2xl p-6 space-y-4 max-h-[450px] overflow-y-auto no-scrollbar">
                            <h4 className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">Animation Queue</h4>
                            <div className="space-y-2">
                                {animations.length > 0 ? animations.map((url, i) => {
                                    const word = url.split('/').pop().split('.')[0];
                                    return (
                                        <div 
                                            key={i}
                                            className={`p-3 rounded-lg flex items-center gap-3 transition-all ${
                                                i === currentIndex ? 'bg-primary/20 border border-primary/20' : 'bg-white/5 border border-transparent'
                                            }`}
                                        >
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                                i < currentIndex ? 'bg-green-500/20 text-green-400' : 
                                                i === currentIndex ? 'bg-primary text-white' : 'bg-white/10 text-white/40'
                                            }`}>
                                                {i < currentIndex ? "✓" : i + 1}
                                            </span>
                                            <span className={`text-sm font-medium ${i === currentIndex ? 'text-white' : 'text-white/40'}`}>
                                                {decodeURIComponent(word)}
                                            </span>
                                        </div>
                                    );
                                }) : (
                                    <p className="text-xs text-on-surface-variant/30 italic">No queue active</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default TextToSign;
