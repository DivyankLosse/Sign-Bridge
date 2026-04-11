import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ENDPOINTS } from '../utils/constants';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await api.post(ENDPOINTS.LOGIN, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            localStorage.setItem('token', response.data.access_token);

            // Fetch user details
            try {
                const userResponse = await api.get(ENDPOINTS.ME);
                localStorage.setItem('user', JSON.stringify(userResponse.data));
            } catch (userErr) {
                console.error("Failed to fetch user details", userErr);
                // Fallback user if fetch fails
                localStorage.setItem('user', JSON.stringify({ full_name: 'User', email: email }));
            }

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-x-hidden antialiased min-h-screen flex flex-col relative">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-40"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen opacity-30"></div>
            </div>

            <header className="relative z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#2c2348] px-6 lg:px-10 py-4 bg-white/50 dark:bg-[#151122]/50 backdrop-blur-md">
                <Link to="/" className="flex items-center gap-4 cursor-pointer">
                    <div className="size-8 text-primary">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
                    </div>
                    <h2 className="hidden sm:block text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Papago Sign</h2>
                </Link>
                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline-block text-sm text-slate-500 dark:text-[#a092c9]">New to Papago Sign?</span>
                    <Link to="/signup">
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-transparent border border-slate-200 dark:border-[#3f3267] text-slate-900 dark:text-white text-sm font-bold leading-normal hover:bg-slate-100 dark:hover:bg-[#2c2348] transition-colors">
                            <span className="truncate">Sign Up</span>
                        </button>
                    </Link>
                </div>
            </header>

            <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-4 py-12">
                <div className="w-full max-w-[500px] rounded-2xl bg-white/80 dark:bg-[#201933]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden">
                    <div className="p-8 sm:p-10 flex flex-col gap-6">
                        <div className="text-center mb-2">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                            <p className="text-slate-500 dark:text-[#a092c9] text-sm">Enter your credentials to access your workspace.</p>
                        </div>

                        {error && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-900 dark:text-white text-sm font-semibold" htmlFor="email">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#a092c9]">
                                        <span className="material-symbols-outlined text-[20px]">mail</span>
                                    </div>
                                    <input
                                        className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-[#151022]/50 border border-slate-200 dark:border-[#3f3267] rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#a092c9]/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-medium"
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-slate-900 dark:text-white text-sm font-semibold" htmlFor="password">Password</label>
                                    <a className="text-xs font-medium text-primary hover:text-primary-hover hover:underline" href="#">Forgot Password?</a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#a092c9]">
                                        <span className="material-symbols-outlined text-[20px]">lock</span>
                                    </div>
                                    <input
                                        className="w-full h-12 pl-12 pr-12 bg-slate-50 dark:bg-[#151022]/50 border border-slate-200 dark:border-[#3f3267] rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#a092c9]/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-medium"
                                        id="password"
                                        placeholder="Enter your password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#a092c9] hover:text-primary transition-colors" type="button">
                                        <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="mt-2 w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-full shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                                <span>Sign In</span>
                                <span className="material-symbols-outlined text-[20px]">login</span>
                            </button>
                        </form>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-[#3f3267]"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-[#201933] px-4 text-slate-400 dark:text-[#a092c9]">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 h-12 rounded-xl bg-slate-50 dark:bg-[#2c2348]/50 hover:bg-slate-100 dark:hover:bg-[#2c2348] border border-slate-200 dark:border-[#3f3267] transition-all">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                <span className="text-sm font-semibold text-slate-700 dark:text-white">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-3 h-12 rounded-xl bg-slate-50 dark:bg-[#2c2348]/50 hover:bg-slate-100 dark:hover:bg-[#2c2348] border border-slate-200 dark:border-[#3f3267] transition-all">
                                <svg className="w-5 h-5 text-slate-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.38-1.07-.52-2.09-.51-3.2 0-1.39.63-2.21.36-3.04-.38-4.22-3.79-3.66-9.92.51-11.43 1.13-.42 2.37-.29 3.25.29.83.56 1.7.54 2.65-.02.94-.55 2.32-.61 3.56.09 1.48.82 2.2 2.08 2.22 2.1-.03.04-.3.92-.85 1.68-.69.95-1.36 1.96-2.02 2.23v-.01c0 .01 0 .01 0 .01zM11.96 5.67c-.03-1.63 1.18-3.12 2.72-3.26.19 1.67-1.42 3.31-2.72 3.26z"></path>
                                </svg>
                                <span className="text-sm font-semibold text-slate-700 dark:text-white">Apple</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-[#2c2348]/30 px-8 py-4 border-t border-slate-100 dark:border-[#3f3267]/50 text-center">
                        <p className="text-sm text-slate-500 dark:text-[#a092c9]">
                            Don't have an account?
                            <Link to="/signup" className="text-primary hover:underline font-bold ml-1">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
