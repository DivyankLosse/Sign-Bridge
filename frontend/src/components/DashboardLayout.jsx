import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, title }) => {
    // Helper to get user safely
    function getSavedUser() {
        try {
            return JSON.parse(localStorage.getItem('user')) || {};
        } catch (e) {
            return {};
        }
    }
    const user = getSavedUser();

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex font-display text-slate-900 dark:text-white transition-colors duration-300">
            {/* Sidebar */}
            <Sidebar user={user} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-[padding] duration-300">
                {/* Header */}
                <Header title={title || "Papago Sign"} user={user} />

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden p-4 md:p-8 lg:p-10 relative">
                    {/* Gradient Background Effect (Subtle) */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2 z-0"></div>

                    <div className="relative z-10 h-full flex flex-col">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
