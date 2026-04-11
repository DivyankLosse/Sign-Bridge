import React from 'react';
import TopNavbar from '../components/TopNavbar';

const Settings = () => {
    return (
        <>
            <TopNavbar title="Settings">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">Admin Console</span>
            </TopNavbar>
            <div className="max-w-5xl mx-auto px-12 py-12 space-y-12 w-full">
                {/* Hero Header */}
                <section className="relative h-48 rounded-lg overflow-hidden flex items-end p-8">
                    <div className="absolute inset-0 z-0">
                        <img alt="Abstract visual" className="w-full h-full object-cover opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt_T06Y-UWVk_BgX5LCUd-p5Pqr_1Tji8rfTTFEFQN5N_5FS-_xUmc3PYamPuozfEMQkpgBvpRnri0iIW9jWv8tvQC1gByKlS88qodKhSeL24BirKl9JclYbxiZ3dr085O_eD6RrPcKQBy_SMcjQy5_xu_1KPWRhgfvzpXHkEWZYHU5bAWhyh-ZYQlZQsxuniZTtG5A3urvVbTkFrK9rtHadbO3qST-aWbqc9HHJOK7kQvO3pqcQg3Cqq1_vnDM62-i94dh4V89YfJ"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
                    </div>
                    <div className="relative z-10 flex flex-col">
                        <h3 className="text-4xl font-extrabold text-on-surface font-headline tracking-tighter">System Configuration</h3>
                        <p className="text-on-surface-variant max-w-lg mt-2">Manage your AI translation preferences and personal account security protocols.</p>
                    </div>
                </section>
                
                {/* Settings Grid */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Profile */}
                    <div className="col-span-12 md:col-span-8 bg-white/5 backdrop-blur-xl rounded-lg p-8 border border-white/10 shadow-2xl relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-3">
                                <span className="material-symbols-outlined text-primary">account_circle</span>
                                <h4 className="text-xl font-bold font-headline tracking-tight">Profile Information</h4>
                            </div>
                            <button className="px-6 py-2 bg-gradient-to-tr from-primary-container to-secondary-container rounded-full text-sm font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105 active:scale-95 transition-all">Save Changes</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="col-span-1 md:col-span-2 flex items-center space-x-6 mb-4">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary">
                                        <div className="w-full h-full rounded-full bg-surface-container-lowest overflow-hidden">
                                            <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3FuxdLSyKisE3mF-fbJhTJ_uTGvNER19RcWLW3uwUbEvgN0wuDJ6mn6BhJgoMXOlT6BoCijyguqiuQayaWO9W9ynDwFK1ldSdz-pMNuH0M9G2XDDAHz9IHkySWbyU827dUhCvNgvrIwy5Vw4RnH4249j8V7ijHpG6wmZv2ife0WCFdFZpSgVA02-j3MJ5GTp554ierFXSNTs_BCgJkKfhqUnGIrJvuy7Vd1DFl-JB-BsAMeNuSWDFpzfkwWWr9SCYAYHDkrqfOuE6"/>
                                        </div>
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-lg border-2 border-surface">
                                        <span className="material-symbols-outlined text-xs">edit</span>
                                    </button>
                                </div>
                                <div>
                                    <h5 className="text-lg font-bold font-headline tracking-tight">Elias Thorne</h5>
                                    <p className="text-sm text-on-surface-variant">Senior Translation Specialist</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/50 ml-1">Full Name</label>
                                <input className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all font-medium text-on-surface" type="text" defaultValue="Elias Thorne"/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/50 ml-1">Email Address</label>
                                <input className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-all font-medium text-on-surface" type="email" defaultValue="elias.thorne@signbridge.ai"/>
                            </div>
                        </div>
                    </div>
                    
                    {/* Security */}
                    <div className="col-span-12 md:col-span-4 bg-surface-container-low rounded-lg p-8 shadow-2xl space-y-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-6">
                                <span className="material-symbols-outlined text-secondary">lock</span>
                                <h4 className="text-xl font-bold font-headline tracking-tight">Security</h4>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-surface-container-highest/30 rounded-xl border border-white/5 group hover:border-primary/20 transition-all cursor-pointer">
                                    <div>
                                        <p className="text-sm font-bold font-headline">Password</p>
                                        <p className="text-[10px] text-on-surface-variant">Last updated 12 days ago</p>
                                    </div>
                                    <span className="material-symbols-outlined text-on-surface-variant/50 group-hover:text-primary transition-colors">chevron_right</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-surface-container-highest/30 rounded-xl border border-white/5 group hover:border-primary/20 transition-all cursor-pointer">
                                    <div>
                                        <p className="text-sm font-bold font-headline">2FA Security</p>
                                        <p className="text-[10px] text-tertiary font-bold uppercase tracking-tighter">Active</p>
                                    </div>
                                    <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-on-surface border border-white/10 rounded-full text-sm font-bold transition-all">Terminate All Sessions</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;
