import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const mobileItems = [
    { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/learn', icon: 'school', label: 'Learn' },
    { to: '/translator', icon: 'translate', label: 'Translate', primary: true },
    { to: '/history', icon: 'history', label: 'History' },
    { to: '/settings', icon: 'settings', label: 'Settings' },
];

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:ml-72 min-h-screen relative flex flex-col">
                <Outlet />
                
                {/* Mobile Navigation */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 min-h-16 bg-surface/85 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 py-2 z-50">
                    {mobileItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium transition ${
                                    item.primary
                                        ? 'mx-1 -mt-7 h-14 max-w-[72px] rounded-full bg-gradient-to-br from-primary-container to-secondary-container text-white shadow-lg'
                                        : isActive
                                            ? 'text-primary'
                                            : 'text-on-surface-variant/70'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined text-xl">{item.primary ? 'add' : item.icon}</span>
                            {!item.primary && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>
            </main>
        </div>
    );
};

export default DashboardLayout;
