import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden">
            {/* Navbar */}
            <div className="relative w-full border-b border-gray-200 dark:border-[#2c2348] bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
                <div className="layout-container flex justify-center">
                    <div className="px-4 md:px-10 py-4 w-full max-w-7xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
                                <span className="material-symbols-outlined text-2xl">translate</span>
                            </div>
                            <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">Papago Sign</h2>
                        </div>
                        <div className="hidden md:flex flex-1 justify-end items-center gap-8">
                            <nav className="flex gap-6">
                                <a className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="#">Features</a>
                                <a className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="#">How it Works</a>
                                <a className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="#">About Us</a>
                                <a className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors" href="#">Pricing</a>
                            </nav>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="flex items-center justify-center rounded-xl h-10 px-5 bg-transparent border border-gray-200 dark:border-[#3f3267] text-slate-900 dark:text-white text-sm font-bold hover:bg-gray-100 dark:hover:bg-[#2c2348] transition-all">
                                    Log In
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="flex items-center justify-center rounded-xl h-10 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/25 transition-all">
                                    Get Started
                                </button>
                            </div>
                        </div>
                        <button className="md:hidden text-slate-900 dark:text-white">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative w-full flex flex-col items-center justify-center min-h-[85vh] py-10 lg:py-20 bg-hero-glow">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="layout-content-container flex flex-col max-w-7xl w-full px-4 md:px-10 z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex flex-col gap-6 lg:w-1/2 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit mx-auto lg:mx-0">
                                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
                                <span className="text-xs font-semibold text-primary dark:text-accent-cyan uppercase tracking-wide">AI 2.0 Now Live</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                                Breaking Communication Barriers with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-cyan">Papago Sign</span>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Experience seamless, real-time sign language translation powered by advanced motion tracking and neural networks. Bridge the gap instantly.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                                <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white text-base font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all transform hover:-translate-y-0.5">
                                    Start Translating
                                </button>
                                <button onClick={() => navigate('/game')} className="flex items-center gap-2 justify-center h-14 px-8 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-[#3f3267] text-slate-900 dark:text-white text-base font-bold hover:bg-gray-50 dark:hover:bg-[#2c2348] transition-all">
                                    <span className="material-symbols-outlined text-primary">play_circle</span>
                                    Play Game Mode
                                </button>
                            </div>
                            <div className="flex items-center gap-4 justify-center lg:justify-start pt-4 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-background-dark"></div>
                                    <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-500 border-2 border-white dark:border-background-dark"></div>
                                    <div className="w-8 h-8 rounded-full bg-gray-500 dark:bg-gray-400 border-2 border-white dark:border-background-dark"></div>
                                </div>
                                <p>Trusted by 10,000+ users worldwide</p>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-600 to-accent-cyan rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-cover bg-center rounded-2xl border border-white/10 shadow-2xl overflow-hidden" data-alt="Abstract visualization of digital data nodes and AI neural network connections glowing in blue and purple" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCIqQasDpXYOIOeNIbX62VQGwOD5tjR5_cx5seesaKgJRHmjIT66CrOmtbU9AcIk--JEINn8H95V7qCOgh2jkQmPLW4nQXDi-iBGYB7Z7LxgUfca3E2YwjADYFuk4wwnL7a3nGFYF5cE6V3N2bb9XHdfpMKbDc2gggE30vBd_1QleUQSafBgFrPkNQeXuRpQjKQ3U1Dae-PFYY9t9HqWhLGq7V4oAekq36uq_Kf_kFI6RBFyH_kzZNIoKbV10EFJdfYikI0c9MgsqUa')" }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-60"></div>
                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-accent-cyan">
                                        <span className="material-symbols-outlined animate-pulse">graphic_eq</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase font-semibold">Live Analysis</p>
                                        <p className="text-white font-medium">99.8% Gesture Accuracy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="w-full py-20 bg-white dark:bg-background-dark relative">
                <div className="layout-container flex justify-center">
                    <div className="layout-content-container flex flex-col max-w-7xl px-4 md:px-10 w-full">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
                            <div className="max-w-2xl">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                                    Redefining Accessibility
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-300">
                                    Our core technology leverages state-of-the-art computer vision to interpret sign language with unprecedented accuracy, making communication truly universal.
                                </p>
                            </div>
                            <button className="hidden md:flex items-center gap-2 text-primary dark:text-accent-cyan font-bold hover:underline underline-offset-4 decoration-2">
                                Learn more about our tech
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            <div className="group p-8 rounded-2xl bg-gray-50 dark:bg-card-dark border border-gray-100 dark:border-[#3f3267] hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary dark:text-white mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">front_hand</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Real-Time Recognition</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Instantaneous detection of hand gestures and facial expressions with extremely low latency for natural conversation flow.
                                </p>
                            </div>
                            <div className="group p-8 rounded-2xl bg-gray-50 dark:bg-card-dark border border-gray-100 dark:border-[#3f3267] hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary dark:text-white mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">record_voice_over</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Speech Synthesis</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Converts sign language into natural-sounding speech in over 30 languages, capturing tone and nuance effectively.
                                </p>
                            </div>
                            <div className="group p-8 rounded-2xl bg-gray-50 dark:bg-card-dark border border-gray-100 dark:border-[#3f3267] hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary dark:text-white mb-6 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">public</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Universal Accessibility</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Designed for everyone, everywhere. Works seamlessly on any device with a camera, from smartphones to laptops.
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 md:hidden flex justify-center">
                            <button className="flex items-center gap-2 text-primary font-bold">
                                Learn more about our tech
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative w-full py-24 overflow-hidden">
                <div className="absolute inset-0 bg-background-dark">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background-dark opacity-50"></div>
                    <div className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay" data-alt="Futuristic abstract digital lines and nodes pattern" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDk3njhVz6PWS0wO13bQorw9TSOmwt5N5O_8YitWNpXZmIPQmyFo-d08DOpOHyWXJLCJ5aP58EXHumUSQFY2vPW8nUGVm8zGrATBAJ2DPaOoQM-oeRN8NSO50riRrEdJFFBanCsP3VB89A5H8yCXsVAHBVjgaZX6w8OIGo3UaawZ1j5iYq8mUBaUG3aXQUkPGCLRFvUlV_NdCjZWslD-pxt6y_3u6HxzcKDPDEXN02n7ydyCndCPfRhEiurwn6cjFuKkqvc2qUvMAwa')" }}></div>
                </div>
                <div className="layout-container flex justify-center relative z-10">
                    <div className="layout-content-container flex flex-col items-center text-center max-w-4xl px-4 md:px-10">
                        <span className="material-symbols-outlined text-5xl text-accent-cyan mb-6">verified_user</span>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                            Ready to bridge the gap?
                        </h2>
                        <p className="text-xl text-slate-300 mb-10 max-w-2xl">
                            Join thousands of users communicating freely with Papago Sign. Break down the walls of silence today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button onClick={() => navigate('/signup')} className="flex min-w-[200px] items-center justify-center rounded-xl h-14 px-8 bg-white text-primary text-base font-bold hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
                                Get Started Now
                            </button>
                            <button className="flex min-w-[200px] items-center justify-center rounded-xl h-14 px-8 bg-transparent border border-white/30 text-white text-base font-bold hover:bg-white/10 transition-colors">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-[#2c2348] py-12">
                <div className="layout-container flex justify-center">
                    <div className="layout-content-container flex flex-col max-w-7xl w-full px-4 md:px-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
                            <div className="flex items-center gap-3">
                                <div className="size-6 text-primary dark:text-white flex items-center justify-center">
                                    <span className="material-symbols-outlined">translate</span>
                                </div>
                                <h3 className="text-slate-900 dark:text-white text-xl font-bold">Papago Sign</h3>
                            </div>
                            <div className="flex flex-wrap justify-center gap-8">
                                <a className="text-slate-500 dark:text-[#a092c9] hover:text-primary dark:hover:text-white transition-colors" href="#">Privacy Policy</a>
                                <a className="text-slate-500 dark:text-[#a092c9] hover:text-primary dark:hover:text-white transition-colors" href="#">Terms of Service</a>
                                <a className="text-slate-500 dark:text-[#a092c9] hover:text-primary dark:hover:text-white transition-colors" href="#">Contact Support</a>
                            </div>
                            <div className="flex gap-4">
                                <a className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#201933] flex items-center justify-center text-slate-600 dark:text-[#a092c9] hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all" href="#">
                                    <span className="material-symbols-outlined text-xl">share</span>
                                </a>
                                <a className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#201933] flex items-center justify-center text-slate-600 dark:text-[#a092c9] hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all" href="#">
                                    <span className="material-symbols-outlined text-xl">work</span>
                                </a>
                                <a className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#201933] flex items-center justify-center text-slate-600 dark:text-[#a092c9] hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all" href="#">
                                    <span className="material-symbols-outlined text-xl">photo_camera</span>
                                </a>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-[#2c2348] pt-8 text-center md:text-left">
                            <p className="text-slate-500 dark:text-[#a092c9] text-sm">© 2023 Papago Sign. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
