import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="h-screen w-72 fixed left-0 border-r border-white/10 bg-surface-container-low/30 backdrop-blur-2xl flex flex-col p-6 space-y-4 z-40 hidden md:flex">
            <div className="mb-8 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                        <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>gesture</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-primary header-anchor leading-none">Sign Bridge</h1>
                        <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest mt-1">AI Translation</p>
                    </div>
                </div>
            </div>
            <NavLink to="/translator" className="w-full py-4 px-6 mb-6 rounded-full bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-fixed font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all">
                <span className="material-symbols-outlined text-xl">add</span>
                Start Live Translation
            </NavLink>
            <nav className="flex-grow space-y-2">
                <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-full transition-all group ${isActive ? 'bg-white/10 text-primary-container shadow-[0_0_15px_rgba(139,92,246,0.2)] font-medium' : 'text-on-surface-variant/70 hover:text-on-surface hover:bg-white/5'}`}>
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="font-medium">Dashboard</span>
                </NavLink>
                <NavLink to="/learn" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-full transition-all group ${isActive ? 'bg-white/10 text-primary-container shadow-[0_0_15px_rgba(139,92,246,0.2)] font-medium' : 'text-on-surface-variant/70 hover:text-on-surface hover:bg-white/5'}`}>
                    <span className="material-symbols-outlined">school</span>
                    <span className="font-medium">Learn</span>
                </NavLink>
                <NavLink to="/translator" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-full transition-all group ${isActive ? 'bg-white/10 text-primary-container shadow-[0_0_15px_rgba(139,92,246,0.2)] font-medium' : 'text-on-surface-variant/70 hover:text-on-surface hover:bg-white/5'}`}>
                    <span className="material-symbols-outlined">translate</span>
                    <span className="font-medium">Translator</span>
                </NavLink>
                <NavLink to="/text-to-sign" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-full transition-all group ${isActive ? 'bg-white/10 text-primary-container shadow-[0_0_15px_rgba(139,92,246,0.2)] font-medium' : 'text-on-surface-variant/70 hover:text-on-surface hover:bg-white/5'}`}>
                    <span className="material-symbols-outlined">gesture</span>
                    <span className="font-medium">Text-to-Sign</span>
                </NavLink>
                <NavLink to="/history" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-full transition-all group ${isActive ? 'bg-white/10 text-primary-container shadow-[0_0_15px_rgba(139,92,246,0.2)] font-medium' : 'text-on-surface-variant/70 hover:text-on-surface hover:bg-white/5'}`}>
                    <span className="material-symbols-outlined">history</span>
                    <span className="font-medium">History</span>
                </NavLink>
                <NavLink to="/settings" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-full transition-all group ${isActive ? 'bg-white/10 text-primary-container shadow-[0_0_15px_rgba(139,92,246,0.2)] font-medium' : 'text-on-surface-variant/70 hover:text-on-surface hover:bg-white/5'}`}>
                    <span className="material-symbols-outlined">settings</span>
                    <span className="font-medium">Settings</span>
                </NavLink>
            </nav>
            <div className="pt-6 border-t border-white/5 space-y-2">
                <NavLink to="/support" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-full transition-all ${isActive ? 'bg-white/10 text-primary-container shadow-[0_0_15px_rgba(139,92,246,0.2)] font-medium' : 'text-on-surface-variant/70 hover:text-on-surface hover:bg-white/5'}`}>
                    <span className="material-symbols-outlined">help</span>
                    <span className="font-medium">Support</span>
                </NavLink>
                <div className="flex items-center justify-between px-3 py-3 bg-white/5 rounded-2xl mt-4 border border-white/5">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
                            {user?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate w-28">{user?.full_name || 'User'}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 p-1 transition-colors shrink-0" title="Logout">
                        <span className="material-symbols-outlined text-lg">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
