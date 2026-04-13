import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../hooks/useUserStats';
import { useHistory } from '../hooks/useHistory';
import { useLearnProgress } from '../hooks/useLearnProgress';
import { Link } from 'react-router-dom';
import { Play, BookOpen, Clock, Activity, Settings as SettingsIcon, GraduationCap } from 'lucide-react';

const DashboardCard = ({ title, value, icon, description }) => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/20 rounded-xl text-primary">
                {icon}
            </div>
            <span className="text-sm text-gray-400">{description}</span>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 font-medium">{title}</p>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const { stats, loading: statsLoading } = useUserStats();
    const { history, loading: historyLoading } = useHistory();
    const { progress } = useLearnProgress();

    const renderHistoryCard = (item) => (
        <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${item.confidence > 0.8 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <div>
                    <h4 className="text-white font-medium">{item.predicted_text || item.original_text || item.content}</h4>
                    <p className="text-sm text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="text-right">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-lg">
                    {Math.round((item.confidence || 0) * 100)}% Match
                </span>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <header className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome back, {user?.full_name || 'Signer'} <span className="wave inline-block origin-bottom-right hover:animate-wave">👋</span>
                </h1>
                <p className="text-gray-400 text-lg">Here's your translation activity overview.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <DashboardCard 
                    title="Total Translations" 
                    value={statsLoading ? "..." : stats?.total_translations || 0}
                    icon={<Activity className="w-6 h-6" />}
                    description="All time"
                />
                <DashboardCard 
                    title="Active Minutes" 
                    value={statsLoading ? "..." : stats?.active_time_minutes || 0}
                    icon={<Clock className="w-6 h-6" />}
                    description="Estimated"
                />
                <DashboardCard 
                    title="Avg Accuracy" 
                    value={statsLoading ? "..." : `${Math.round(stats?.accuracy_rate || 0)}%`}
                    icon={<Play className="w-6 h-6" />}
                    description="Confidence level"
                />
                <DashboardCard 
                    title="Learning XP" 
                    value={progress.xp}
                    icon={<GraduationCap className="w-6 h-6" />}
                    description={`${progress.signsLearned.length} signs learned`}
               />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                Recent Activity
                            </h2>
                            <Link to="/history" className="text-primary hover:text-primary-light text-sm font-medium transition-colors">
                                View Full History →
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {historyLoading ? (
                                <div className="text-center py-8 text-gray-400">Loading history...</div>
                            ) : history.length > 0 ? (
                                history.slice(0, 5).map(renderHistoryCard)
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-4">
                                        <BookOpen className="w-8 h-8 text-gray-500" />
                                    </div>
                                    <h3 className="text-white font-medium mb-1">No activity yet</h3>
                                    <p className="text-gray-400 text-sm">Start translating signs to see them here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary/20 to-purple-500/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-2">Live Translator</h3>
                            <p className="text-gray-300 mb-6 text-sm">
                                Real-time sign language recognition powered by our latest AI models.
                            </p>
                            <Link to="/translator" className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/25">
                                Start Session
                                <Play className="w-4 h-4 ml-2 fill-current" />
                            </Link>
                        </div>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                         <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                         <div className="space-y-3">
                             <Link to="/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                                 <SettingsIcon className="w-5 h-5" />
                                 <span>Preferences</span>
                             </Link>
                             <Link to="/text-to-sign" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                                 <BookOpen className="w-5 h-5" />
                                 <span>Text to Sign</span>
                             </Link>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
