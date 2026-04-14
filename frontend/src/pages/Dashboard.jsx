import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, BookOpen, Clock, Play, Settings as SettingsIcon, Signal } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../hooks/useUserStats';
import { useHistory } from '../hooks/useHistory';
import { useLearnProgress } from '../hooks/useLearnProgress';

const DashboardCard = ({ title, value, icon, description }) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:bg-white/10">
        <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-primary/20 p-3 text-primary">{icon}</div>
            <span className="text-sm text-gray-400">{description}</span>
        </div>
        <h3 className="mb-1 text-3xl font-bold text-white">{value}</h3>
        <p className="font-medium text-gray-400">{title}</p>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const { stats, loading: statsLoading, error: statsError } = useUserStats();
    const { history, loading: historyLoading, error: historyError } = useHistory();
    const { progress } = useLearnProgress();
    const [isSessionActive, setIsSessionActive] = useState(
        () => localStorage.getItem('translatorSessionActive') === 'true'
    );

    useEffect(() => {
        const syncSessionState = () => {
            setIsSessionActive(localStorage.getItem('translatorSessionActive') === 'true');
        };

        window.addEventListener('storage', syncSessionState);
        const interval = window.setInterval(syncSessionState, 1500);

        return () => {
            window.removeEventListener('storage', syncSessionState);
            window.clearInterval(interval);
        };
    }, []);

    const recentHistory = history.slice(0, 5);

    return (
        <div className="mx-auto max-w-7xl animate-fade-in p-4 pb-24 md:p-8 md:pb-8">
            <header className="mb-10">
                <h1 className="mb-2 text-3xl md:text-4xl font-bold text-white">
                    Welcome back, {user?.full_name || 'Signer'}
                </h1>
                <p className="text-base md:text-lg text-gray-400">
                    Here&apos;s your translation activity overview.
                </p>
            </header>

            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <DashboardCard
                    title="Total Sessions"
                    value={statsLoading ? '...' : stats?.total_sessions || 0}
                    icon={<Signal className="h-6 w-6" />}
                    description="Live translator"
                />
                <DashboardCard
                    title="Total Translations"
                    value={statsLoading ? '...' : stats?.total_translations || 0}
                    icon={<Activity className="h-6 w-6" />}
                    description="All modules"
                />
                <DashboardCard
                    title="Active Minutes"
                    value={statsLoading ? '...' : stats?.active_time_minutes || 0}
                    icon={<Clock className="h-6 w-6" />}
                    description="Estimated"
                />
                <DashboardCard
                    title="Translator Session"
                    value={isSessionActive ? 'Live' : 'Idle'}
                    icon={<Play className="h-6 w-6" />}
                    description={isSessionActive ? 'Camera session active' : `${progress.signsLearned.length} signs learned`}
                />
            </div>

            {(statsError || historyError) && (
                <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                    {statsError || historyError}
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                <Clock className="h-5 w-5 text-primary" />
                                Recent Activity
                            </h2>
                            <Link to="/history" className="text-sm font-medium text-primary transition-colors hover:text-primary-light">
                                View Full History
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {historyLoading ? (
                                <div className="py-8 text-center text-gray-400">Loading history...</div>
                            ) : recentHistory.length > 0 ? (
                                recentHistory.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col gap-3 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`h-2 w-2 rounded-full ${(item.confidence || 0) > 0.8 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                            <div>
                                                <h4 className="font-medium text-white">
                                                    {item.predicted_text || item.original_text || item.content}
                                                </h4>
                                                <p className="text-sm text-gray-400">
                                                    {new Date(item.timestamp || item.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-mono text-primary">
                                                {Math.round((item.confidence || 0) * 100)}% Match
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                                        <BookOpen className="h-8 w-8 text-gray-500" />
                                    </div>
                                    <h3 className="mb-1 font-medium text-white">No activity yet</h3>
                                    <p className="text-sm text-gray-400">Start translating signs to see them here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 to-purple-500/10 p-6">
                        <div className="absolute inset-0 translate-y-full bg-primary/10 transition-transform duration-500 group-hover:translate-y-0" />
                        <div className="relative z-10">
                            <h3 className="mb-2 text-2xl font-bold text-white">Live Translator</h3>
                            <p className="mb-6 text-sm text-gray-300">
                                Real-time sign language recognition powered by our latest ASL pipeline.
                            </p>
                            <Link to="/translator" className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-all shadow-lg shadow-primary/25 hover:bg-primary-light">
                                Start Session
                                <Play className="ml-2 h-4 w-4 fill-current" />
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                        <h3 className="mb-4 text-lg font-bold text-white">Quick Links</h3>
                        <div className="space-y-3">
                            <Link to="/settings" className="flex items-center gap-3 rounded-xl p-3 text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
                                <SettingsIcon className="h-5 w-5" />
                                <span>Preferences</span>
                            </Link>
                            <Link to="/text-to-sign" className="flex items-center gap-3 rounded-xl p-3 text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
                                <BookOpen className="h-5 w-5" />
                                <span>Text to Sign</span>
                            </Link>
                            <Link to="/support" className="flex items-center gap-3 rounded-xl p-3 text-gray-300 transition-colors hover:bg-white/5 hover:text-white">
                                <Activity className="h-5 w-5" />
                                <span>Support</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
