import React from 'react';
import TopNavbar from '../components/TopNavbar';

const TextToSign = () => {
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
                            <div className="flex gap-3">
                                <button className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">history_edu</span> Clear History
                                </button>
                            </div>
                        </div>
                        <div className="relative group">
                            <textarea className="w-full h-48 bg-surface-container-lowest/50 border-none ring-1 ring-outline-variant/20 rounded-lg p-6 text-xl font-medium placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all resize-none" placeholder="Type a phrase like 'How can I help you today?'..."></textarea>
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant/50 transition-colors">
                                    <span className="material-symbols-outlined">mic</span>
                                </button>
                                <button className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant/50 transition-colors">
                                    <span className="material-symbols-outlined">upload_file</span>
                                </button>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button className="gradient-button text-white font-extrabold px-12 py-5 rounded-full flex items-center gap-3 text-lg hover:shadow-[0_0_30px_rgba(160,120,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                                Generate Signs
                                <span className="material-symbols-outlined">rocket_launch</span>
                            </button>
                        </div>
                    </div>
                </section>
                
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-on-surface flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-primary rounded-full"></span>
                            Translation Result
                        </h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-6 px-1 mask-linear-right">
                        <div className="min-w-[240px] glass-panel rounded-lg overflow-hidden group cursor-pointer hover:border-primary/30 transition-all">
                            <div className="h-40 bg-surface-container-highest relative overflow-hidden">
                                <img className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq78UCTC7IF3bEtB0xVngQf7sVrIVGaCUhOUlZ1W690M3vCjDSGF8nOgscwUKkNNhjEVLVMaLlAXo4ZbU_7rZEC07sF5wkuE2epWpvwU_hi_IPrhTCY7ORHS93p-PEVgZ9qhqaGvYgFk9Ko1hYZzCcy5YjVmYhp9pH91vLQmxHbA0oXpq1oDypsy-8k1GmNghxRqC910sNJk58wyM1irCcTclsWXsEgFweabl1WklrnEZaaqyE24uIInz9ZTezrqnEY5BobWM8mZ7w" alt="Hello"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
                                <div className="absolute bottom-3 left-3 px-2 py-1 bg-primary/20 backdrop-blur-md rounded text-[10px] font-bold text-primary uppercase tracking-wider">Hello</div>
                            </div>
                        </div>
                        <div className="min-w-[240px] glass-panel rounded-lg overflow-hidden group cursor-pointer hover:border-primary/30 transition-all">
                            <div className="h-40 bg-surface-container-highest relative overflow-hidden">
                                <img className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxG6JCLv1rqwTslhZfSJCIm34TlJGqQJKNBAorbX7SxJ6pmXLoSS59vGLWWWv6U9ofFTgG884Ch-GyUvVD2RFN3PFJq4xoe9escL6_hs3-dzP43R28u38k6x1sAZYvIzBnBelPaNu0ulxMSspBuoyA3wl7U0u15pJsPgzfhvnq4b9s1kbB43hCVxM4GrIwmShvAnmTRPIK-d0YXOKxMOleEUKHLlKY5iiCljeUnoI1cx3qejB1-pMrRNjO6ZVBSxZNPic5cvZ1PCIS" alt="How"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
                                <div className="absolute bottom-3 left-3 px-2 py-1 bg-primary/20 backdrop-blur-md rounded text-[10px] font-bold text-primary uppercase tracking-wider">How</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default TextToSign;
