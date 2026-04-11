import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ title }) => {
    // Basic standard actions if none provided
    return (
        <header className="flex-shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-white/5 px-6 py-4 bg-white/80 dark:bg-[#151022]/90 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Trigger (Visible on small screens) */}
                <div className="lg:hidden text-slate-900 dark:text-white cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 p-2 rounded-lg transition-colors">
                    <span className="material-symbols-outlined">menu</span>
                </div>

                {/* Page Title */}
                {title && (
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight hidden sm:block">
                        {title}
                    </h2>
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar - Optional, can be hidden via props if needed */}
                <div className="relative hidden md:block">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
                    <input
                        className="h-10 pl-10 pr-4 rounded-xl bg-slate-100 dark:bg-[#2c2348] border-none text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary placeholder-slate-400 w-64 transition-all"
                        placeholder="Search..."
                        type="text"
                    />
                </div>

                {/* Notifications */}
                <button className="relative flex items-center justify-center size-10 rounded-xl bg-slate-100 dark:bg-[#2c2348] text-slate-600 dark:text-slate-200 hover:text-primary hover:bg-primary/10 transition-all">
                    <span className="material-symbols-outlined text-[22px]">notifications</span>
                    <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#2c2348]"></span>
                </button>

                {/* Avatar (Mobile only, since sidebar present on Desktop) */}
                <Link to="/settings" className="lg:hidden size-9 rounded-full bg-cover bg-center ring-2 ring-slate-200 dark:ring-white/10"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuApnZdl7-k1UrVfPpaqNypWe14hPRaKVWJB16yYyiuM7cH9D_p8lG_gJKffCb3Ux49g60fNpjOryh8x9C2cjD83QFrdNmEHw-pStmHFPj_GFFssZ0LCZUmfmzamZ8gxo6g38lssX4P4KlmUCTFSMG9y0jIa5r9gr_AGzJAh_j_1YdWEMYKv0KGTpzLFTnPzyrzfQCZRvHhjM4IUW26EOhhBD7gOctmrn3Q23j9ptPwgjxui1yiWkyyrb4J2uU25YtkAFkMDAnIkAQtg")' }}>
                </Link>
            </div>
        </header>
    );
};

export default Header;
