import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const Landing = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Shared motion variants for staggered scroll reveals
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.8, ease: "easeOut" } 
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const supportedLanguages = [
        { code: 'ASL', name: 'American Sign Language' },
    ];

    return (
        <div className="overflow-x-hidden text-[#e4e1ec] font-body bg-background selection:bg-primary/30">
            {/* Top Navigation Shell */}
            <header className="fixed top-0 w-full z-50 bg-[#0B0B12]/80 backdrop-blur-xl border-b border-white/5">
                <nav className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold tracking-tighter text-[#e4e1ec] font-headline flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary material-filled">sign_language</span>
                        Sign Bridge
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link className="text-primary border-b-2 border-primary pb-1 font-headline font-bold tracking-tight" to="/">Platform</Link>
                        
                        {/* Solutions Dropdown */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('solutions')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="text-on-surface-variant hover:text-white transition-colors font-headline font-bold tracking-tight flex items-center gap-1">
                                Solutions <span className="material-symbols-outlined text-sm transition-transform duration-200" style={{ transform: activeDropdown === 'solutions' ? 'rotate(180deg)' : '' }}>expand_more</span>
                            </button>
                            <AnimatePresence>
                                {activeDropdown === 'solutions' && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-0 mt-4 w-64 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 z-50 text-left"
                                    >
                                        <a href="#solutions" className="block px-4 py-3 hover:bg-surface-soft group">
                                            <div className="font-bold text-sm group-hover:text-primary transition-colors">Realtime Interpreter</div>
                                            <div className="text-xs text-muted mt-0.5">High accuracy ASL scanning</div>
                                        </a>
                                        <a href="#solutions" className="block px-4 py-3 hover:bg-surface-soft group">
                                            <div className="font-bold text-sm group-hover:text-secondary transition-colors">Enterprise API</div>
                                            <div className="text-xs text-muted mt-0.5">Embeds for your platforms</div>
                                        </a>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {/* Translator Tooltip Dropdown */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('translator')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="text-on-surface-variant hover:text-white transition-colors font-headline font-bold tracking-tight flex items-center gap-1">
                                Translator <span className="material-symbols-outlined text-sm transition-transform duration-200" style={{ transform: activeDropdown === 'translator' ? 'rotate(180deg)' : '' }}>expand_more</span>
                            </button>
                            <AnimatePresence>
                                {activeDropdown === 'translator' && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-0 mt-4 w-56 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden p-3 z-50 text-left"
                                    >
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 px-2">Supported</div>
                                        {supportedLanguages.map(lang => (
                                            <div key={lang.code} className="flex items-center gap-3 px-2 py-2 hover:bg-surface-soft rounded-lg cursor-default">
                                                <div className="w-8 h-6 bg-surface-strong border border-outline rounded flex items-center justify-center text-[10px] font-bold text-primary">{lang.code}</div>
                                                <div className="text-xs text-ink font-semibold">{lang.name}</div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                    <div className="flex items-center space-x-4">
                        <Link className="text-on-surface-variant hover:text-white transition-colors text-sm font-semibold" to="/login">Sign In</Link>
                        <Button
                            variant="primary"
                            size="sm"
                            to="/signup"
                            className="rounded-full px-6"
                        >
                            Get Started
                        </Button>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="relative pt-32 pb-20 overflow-hidden">
                {/* Mesh Background Glows */}
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Content Left */}
                    <motion.div 
                        className="relative z-10"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeUp} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold mb-6 outline-variant/10 border border-white/5">
                            <span className="material-symbols-outlined text-sm">auto_awesome</span>
                            <span>ASL-first real-time translation</span>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-6xl md:text-7xl font-bold font-headline tracking-tighter leading-[0.95] text-on-surface mb-8">
                            Break <span className="gradient-text">Communication</span> Barriers with AI
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-xl text-on-surface-variant max-w-lg mb-10 leading-relaxed font-body">
                            Bridge the gap between hearing and deaf communities with our world-class sign language translation engine. Experience instant, fluid, and culturally nuanced communication.
                        </motion.p>
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                            <Button to="/signup" className="rounded-full shadow-lg glow-soft">
                                Start Translating Free
                            </Button>
                            <Button variant="secondary" to="/login" className="rounded-full pr-6 pl-4 flex items-center space-x-2 bg-transparent border-white/20 hover:bg-white/5 text-white">
                                <span className="material-symbols-outlined material-filled text-lg">login</span>
                                <span>Sign In</span>
                            </Button>
                        </motion.div>
                    </motion.div>
                    
                    {/* Orbital UI Right */}
                    <motion.div 
                        className="relative w-full max-w-[500px] aspect-square mx-auto flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        {/* Center Orb */}
                        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-surface-container-high border border-primary/20 flex flex-col items-center justify-center relative z-20 glow-soft">
                            <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full"></div>
                            <span className="text-2xl sm:text-3xl font-bold font-headline text-on-surface">20k+</span>
                            <span className="text-on-surface-variant text-xs sm:text-sm font-medium">Translations</span>
                        </div>
                        
                        {/* Concentric Rings */}
                        <div className="orbital-ring w-[60%] h-[60%]" />
                        <div className="orbital-ring w-[80%] h-[80%]" />
                        <div className="orbital-ring w-[100%] h-[100%]" />
                        
                        {/* Orbiting Avatars/Icons */}
                        <div className="absolute z-30 landing-float left-[45%] bottom-[5%]" style={{ animationDelay: '-3.2s' }}>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-panel flex items-center justify-center text-primary border border-primary/20">
                                <span className="material-symbols-outlined text-sm sm:text-base material-filled">sign_language</span>
                            </div>
                        </div>
                        <div className="absolute z-30 landing-float left-[15%] bottom-[15%]" style={{ animationDelay: '-0.9s' }}>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full glass-panel flex items-center justify-center text-secondary border border-secondary/20">
                                <span className="material-symbols-outlined text-sm sm:text-base material-filled">translate</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Trust Strip */}
            <motion.section 
                className="py-12 bg-surface-container-lowest border-y border-white/5 relative z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
            >
                <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-between items-center opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all gap-8 duration-500">
                    <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-4xl material-filled">neurology</span>
                        <span className="font-headline font-extrabold tracking-tighter text-xl">AI POWERED</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-headline font-bold text-lg">FastAPI</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-headline font-bold text-lg">TensorFlow</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-3xl material-filled">cloud</span>
                        <span className="font-headline font-bold text-lg">AZURE AI</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="font-headline font-bold text-lg">NVIDIA</span>
                    </div>
                </div>
            </motion.section>

            {/* Feature Bento Grid */}
            <section id="solutions" className="py-32 relative">
                <div className="max-w-7xl mx-auto px-8">
                    <motion.div 
                        className="mb-20 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold font-headline mb-6 tracking-tight">Smarter Solutions for <span className="gradient-text">Human Connection</span></h2>
                        <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">Advanced computer vision and neural networks working together to bridge the communication gap.</p>
                    </motion.div>
                    
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {/* Card 1 */}
                        <motion.div variants={fadeUp} className="glass-panel p-10 rounded-lg hover:bg-white/5 transition-all group border-white/10 flex flex-col h-full relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[50px] rounded-full group-hover:bg-primary/20 transition-all duration-500"></div>
                            <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-8 border border-white/10 group-hover:border-primary/50 transition-colors duration-300 z-10">
                                <span className="material-symbols-outlined text-primary text-3xl material-filled">hand_gesture</span>
                            </div>
                            <h3 className="text-2xl font-bold font-headline mb-4 z-10">Real-time Sign Recognition</h3>
                            <p className="text-on-surface-variant leading-relaxed z-10">Instant recognition of complex ASL gestures with over 98% accuracy, translating directly to text or audio.</p>
                        </motion.div>
                        
                        {/* Card 2 */}
                        <motion.div variants={fadeUp} className="glass-panel p-10 rounded-lg hover:bg-white/5 transition-all group border-white/10 flex flex-col h-full relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 blur-[50px] rounded-full group-hover:bg-secondary/20 transition-all duration-500"></div>
                            <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-8 border border-white/10 group-hover:border-secondary/50 transition-colors duration-300 z-10">
                                <span className="material-symbols-outlined text-secondary text-3xl material-filled">animation</span>
                            </div>
                            <h3 className="text-2xl font-bold font-headline mb-4 z-10">Text to Sign Animation</h3>
                            <p className="text-on-surface-variant leading-relaxed z-10">Hyper-realistic 3D avatars that perform sign language from any text input, maintaining natural flow and facial cues.</p>
                        </motion.div>
                        
                        {/* Card 3 */}
                        <motion.div variants={fadeUp} className="glass-panel p-10 rounded-lg hover:bg-white/5 transition-all group border-white/10 flex flex-col h-full relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-tertiary/10 blur-[50px] rounded-full group-hover:bg-tertiary/20 transition-all duration-500"></div>
                            <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-8 border border-white/10 group-hover:border-tertiary/50 transition-colors duration-300 z-10">
                                <span className="material-symbols-outlined text-tertiary text-3xl material-filled">settings_voice</span>
                            </div>
                            <h3 className="text-2xl font-bold font-headline mb-4 z-10">Speech to Sign Conversion</h3>
                            <p className="text-on-surface-variant leading-relaxed z-10">Advanced NLP captures spoken nuances and converts them into culturally accurate sign language structures.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background w-full border-t border-white/5 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 max-w-7xl mx-auto font-body text-sm tracking-tight">
                    <div className="flex flex-col items-center md:items-start space-y-4 mb-8 md:mb-0">
                        <div className="text-xl font-bold text-on-surface font-headline flex items-center gap-2">
                            <span className="material-symbols-outlined material-filled">sign_language</span>
                            Sign Bridge
                        </div>
                        <p className="text-on-surface-variant max-w-xs text-center md:text-left">Revolutionizing accessibility through advanced artificial intelligence.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
