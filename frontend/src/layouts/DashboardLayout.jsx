import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:ml-72 min-h-screen relative flex flex-col">
                <Outlet />
                
                {/* Mobile Navigation */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 z-50">
                    <a className="flex flex-col items-center justify-center text-on-surface-variant/70" href="/dashboard">
                        <span className="material-symbols-outlined text-xl">dashboard</span>
                    </a>
                    <a className="flex flex-col items-center justify-center text-on-surface-variant/70" href="/translator">
                        <span className="material-symbols-outlined text-xl">translate</span>
                    </a>
                    <a className="flex flex-col items-center justify-center w-12 h-12 -mt-8 bg-gradient-to-br from-primary-container to-secondary-container rounded-full shadow-lg text-white" href="#">
                        <span className="material-symbols-outlined">add</span>
                    </a>
                    <a className="flex flex-col items-center justify-center text-on-surface-variant/70" href="/history">
                        <span className="material-symbols-outlined text-xl">history</span>
                    </a>
                    <a className="flex flex-col items-center justify-center text-on-surface-variant/70" href="/settings">
                        <span className="material-symbols-outlined text-xl">settings</span>
                    </a>
                </nav>
            </main>
        </div>
    );
};

export default DashboardLayout;
