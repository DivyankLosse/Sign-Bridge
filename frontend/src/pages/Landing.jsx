import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="selection:bg-primary/30 text-on-surface">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 bg-surface/10 backdrop-blur-xl flex justify-between items-center px-8 h-20 shadow-[0_20px_40px_rgba(139,92,246,0.08)]">
                <div className="text-2xl font-black tracking-tighter font-headline">Sign Bridge</div>
                <div className="hidden md:flex space-x-8">
                    <Link to="/dashboard" className="text-primary font-bold border-b-2 border-primary pb-1 font-headline tracking-tighter">Dashboard</Link>
                    <Link to="/translator" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 font-headline tracking-tighter">Translator</Link>
                    <Link to="/text-to-sign" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 font-headline tracking-tighter">Text-to-Sign</Link>
                </div>
                <div className="flex items-center space-x-6">
                    <Link to="/dashboard" className="text-on-surface-variant font-medium hover:text-primary transition-all duration-300 scale-95 active:scale-90">Sign In</Link>
                    <Link to="/dashboard" className="cta-gradient px-6 py-2.5 rounded-full text-white font-bold scale-95 active:scale-90 transition-all duration-300">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-8 min-h-screen flex items-center hero-gradient overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-bold text-primary tracking-widest uppercase">Next-Gen AI Platform</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-extrabold font-headline leading-[1.1] tracking-tighter text-on-surface">
                            Break Communication Barriers with AI <span className="text-transparent bg-clip-text cta-gradient">Sign Language</span> Translation
                        </h1>
                        <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">
                            Experience seamless communication through real-time sign-to-text and text-to-sign conversion powered by our state-of-the-art neural networks.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/translator" className="cta-gradient px-8 py-4 rounded-full text-white font-extrabold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 hover:-translate-y-1">
                                Start Translating
                            </Link>
                            <button className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 font-bold text-lg hover:bg-white/10 transition-all duration-300">
                                Watch Demo
                            </button>
                        </div>
                    </div>
                    {/* Right Content: Orbital UI */}
                    <div className="relative flex justify-center items-center">
                        <div className="relative w-[400px] h-[400px] md:w-[500px] md:h-[500px]">
                            {/* Central Hub */}
                            <div className="absolute inset-0 m-auto w-48 h-48 rounded-full glass-card flex flex-col items-center justify-center text-center p-6 shadow-[0_0_100px_rgba(139,92,246,0.15)] z-10">
                                <div className="text-3xl font-black font-headline text-primary">20K+</div>
                                <div className="text-xs font-medium text-on-surface-variant uppercase tracking-widest mt-1">Translations</div>
                            </div>
                            {/* Orbital Rings */}
                            <div className="absolute inset-0 rounded-full border border-white/5 scale-[0.7]"></div>
                            <div className="absolute inset-0 rounded-full border border-white/5 scale-[1.1]"></div>
                            {/* Floating Elements */}
                            <div className="orbital-item -translate-x-1/2 -translate-y-[200px]">
                                <div className="glass-card p-4 rounded-2xl flex items-center space-x-3 shadow-2xl">
                                    <img alt="User avatar" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa7OtoPB4UbBIzjfy174K3BYOCtsjmqsOGzde42Vrk6Xex1q8gmVLngK-WWZ9t4RujvgMkfzF7VQj5QMs_3tv3yhIRAbD4axpb1tpUGTbeHbHDFFK0pygIK4v-xBl5pxauigkE7VrlQYJxZ61DhbBJzG6uCCBcOJ6ojA_58wGJkl9cT0aWJbQEnfDsYqWlbZ_LEN1DhC70UNqtP2zEiug2cO-5LVnQjIcP6cs6_YAIU3HoN26EEcYgcXZAe2oxyta-LcvyOsrU7Nmx"/>
                                    <div className="text-xs font-bold">ASL to Text</div>
                                </div>
                            </div>
                            <div className="orbital-item translate-x-[140px] -translate-y-[100px]">
                                <div className="bg-primary/20 p-3 rounded-full border border-primary/40 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">gesture</span>
                                </div>
                            </div>
                            <div className="orbital-item -translate-x-[180px] translate-y-[50px]">
                                <div className="glass-card p-2 rounded-full border border-white/10 shadow-lg">
                                    <img alt="Avatar" className="w-12 h-12 rounded-full border-2 border-primary/30 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9en0b627ErUPYN4mQJfjTfwpBtic38XOzTJQbfwjm1nT12dPljzdmfj9xuQ9pxQTJzckAUKmjrs80l64qORsHw5ri4QGh9P_rnIc1jGzD634OYZZ_pwcr8BLxSMx4xW3Nu6hsbn1awHq7IB092K3x2beJUt0VczjZFRGovtWuyCqFM4AGTjVoHL1MR5AnEzqFSwrD0dUzxITvfExEbgVA7bMmkqC57TA_X0LN7dHMo5MQy-cm4tz8O0PTUcXJWrkSJDMwoEJyxAhY"/>
                                </div>
                            </div>
                            <div className="orbital-item translate-x-[120px] translate-y-[150px]">
                                <div className="glass-card px-4 py-2 rounded-full flex items-center space-x-2 border border-white/10">
                                    <span className="material-symbols-outlined text-sm text-tertiary">auto_awesome</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">AI Processing</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
