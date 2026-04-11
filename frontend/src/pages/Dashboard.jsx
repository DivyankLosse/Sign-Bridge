import React from 'react';
import TopNavbar from '../components/TopNavbar';

const Dashboard = () => {
    return (
        <>
            <TopNavbar title="" />
            <div className="p-8 space-y-10">
                {/* Hero Greeting */}
                <section className="flex flex-col gap-2">
                    <h2 className="text-4xl font-headline font-extrabold tracking-tighter text-on-surface">Welcome back, <span className="text-primary">Alex</span>.</h2>
                    <p className="text-on-surface-variant max-w-lg">Your translation accuracy is up 4% this week. Keep bridging the gap with every sign.</p>
                </section>
                
                {/* Stats Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="glass-panel p-8 rounded-lg relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-7xl text-primary">translate</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-on-surface-variant mb-1">Total Translations</p>
                            <h3 className="text-3xl font-headline font-bold text-on-surface">1,284</h3>
                            <div className="mt-4 flex items-center gap-2 text-primary">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span className="text-xs font-bold">+12% from last month</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    {/* Card 2 */}
                    <div className="glass-panel p-8 rounded-lg relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-7xl text-secondary">schedule</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-on-surface-variant mb-1">Active Time</p>
                            <h3 className="text-3xl font-headline font-bold text-on-surface">42h 15m</h3>
                            <div className="mt-4 flex items-center gap-2 text-secondary">
                                <span className="material-symbols-outlined text-sm">update</span>
                                <span className="text-xs font-bold">8h logged this week</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-secondary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    {/* Card 3 */}
                    <div className="glass-panel p-8 rounded-lg relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-7xl text-tertiary">verified</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-sm font-medium text-on-surface-variant mb-1">Accuracy Rate</p>
                            <h3 className="text-3xl font-headline font-bold text-on-surface">98.2%</h3>
                            <div className="mt-4 flex items-center gap-2 text-tertiary">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                <span className="text-xs font-bold">Top 5% of users</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-tertiary/5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>
                    </div>
                </section>
                
                {/* Main Feature Area */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-8 glass-panel rounded-lg p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-headline font-bold text-on-surface">Recent Activity</h3>
                            <button className="text-primary text-sm font-bold hover:underline">View All History</button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary">videocam</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-on-surface">ASL to English Translation</h4>
                                        <p className="text-xs text-on-surface-variant">Session #4829 • 12 mins ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">Completed</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center">
                                        <span className="material-symbols-outlined text-secondary">text_fields</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-on-surface">Text to BSL Sequence</h4>
                                        <p className="text-xs text-on-surface-variant">Request #9910 • 2 hours ago</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold uppercase tracking-wider">Saved</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Quick Action */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="flex-1 rounded-lg bg-gradient-to-br from-primary-container/20 to-secondary-container/20 border border-white/10 p-8 flex flex-col justify-between overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-headline font-bold text-white mb-2 leading-tight">Master British Sign Language</h3>
                                <p className="text-white/60 text-sm mb-6">Our new BSL dialect model is now 30% more expressive. Try it in the translator now.</p>
                                <button className="bg-white text-on-primary-fixed px-6 py-2.5 rounded-full text-sm font-bold hover:bg-on-surface transition-colors">Start Learning</button>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary blur-[80px] rounded-full opacity-30"></div>
                        </div>
                        <div className="glass-panel rounded-lg p-8">
                            <h4 className="text-sm font-bold text-on-surface mb-4">Device Connectivity</h4>
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-on-surface-variant">Webcam 4K Ultra</span>
                                </div>
                                <span className="material-symbols-outlined text-on-surface-variant/50 text-sm">link</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            
            <footer className="w-full py-12 px-8 border-t border-white/5 bg-surface mt-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-lg font-bold text-on-surface font-headline tracking-tighter">Sign Bridge</h3>
                        <p className="text-sm font-inter tracking-tight text-on-surface-variant/70">© 2024 Sign Bridge AI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Dashboard;
