import React from 'react';

const TopNavbar = ({ title = "", children }) => {
    return (
        <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-30 bg-surface/10 backdrop-blur-xl">
            <h2 className="text-2xl font-black text-on-surface tracking-tighter header-anchor uppercase">{title}</h2>
            {children && <div className="flex-1 px-8">{children}</div>}
            <div className="flex items-center gap-6 ml-auto">
                <div className="relative hidden lg:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
                    <input className="bg-surface-container-lowest border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-1 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant/30" placeholder="Search..." type="text"/>
                </div>
                <div className="flex items-center gap-4">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5 relative group cursor-pointer">
                        <img alt="User profile" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8GCxz5rTTX2eKsKYDuSrcfBvS11QsNTYq65XrsK3sOuQkgeo1x275lGHI2eJBBqaRAKemjKkNEUBYFbD-UNMtYTjE-MZQQ8fPcGUcR2qLjiCPjWVSMkIuwEoENHeXNh26lTGMdx6VwVH2ikFshoLMhhRyeiPRVVbqteOpQ9Ap7HK1ibSdPOU-IZldBshGlc-ps0xszGC91mOZtonkiDxBsfnC8YhawFBdjcZBK7b0E-oRa1AgTYr_31gI7b9RjUf0fj2bIGTNJgJ0"/>
                        <div className="absolute inset-0 rounded-full ring-2 ring-primary/30 group-hover:ring-primary transition-all"></div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;
