import React, { useEffect, useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { Clock, Search, Trash2, Calendar, Languages, Hand } from 'lucide-react';

const TAB_CONFIG = [
    { id: 'sign-to-text', label: 'Sign to Text' },
    { id: 'text-to-sign', label: 'Text to Sign' },
];

const History = () => {
    const { history, loading, error, deleteItem, fetchHistory } = useHistory();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('sign-to-text');

    useEffect(() => {
        fetchHistory({ type: activeTab });
    }, [activeTab, fetchHistory]);

    const filteredHistory = history
        .filter((item) =>
            (item.predicted_text || item.original_text || item.content || '')
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in pb-24 md:pb-8">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Clock className="text-primary" />
                    Translation History
                </h1>
                <p className="text-gray-400">Review and manage your past translation sessions.</p>
            </header>

            <div className="mb-8">
                <div className="mb-5 flex flex-wrap gap-3">
                    {TAB_CONFIG.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                                activeTab === id
                                    ? 'border-primary/40 bg-primary/15 text-white'
                                    : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search translations..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        Loading history...
                    </div>
                ) : error ? (
                    <div className="p-12 text-center text-rose-300">
                        <h3 className="text-xl font-medium text-white mb-2">History unavailable</h3>
                        <p className="text-sm text-gray-400">{error}</p>
                    </div>
                ) : filteredHistory.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {filteredHistory.map((item) => (
                            <div key={item.id} className="p-5 md:p-6 hover:bg-white/5 transition-colors flex flex-col gap-4 md:flex-row md:items-center md:justify-between group">
                                <div className="min-w-0">
                                    <h3 className="text-xl font-medium text-white mb-1">
                                        {item.predicted_text || item.original_text || item.content}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(item.timestamp || item.created_at).toLocaleString()}
                                        </span>
                                        {item.type === 'text-to-sign' && (
                                             <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md text-xs font-bold">
                                                  <Languages className="w-3 h-3" />
                                                  Text to Sign
                                             </span>
                                        )}
                                        {item.type === 'sign-to-text' && (
                                             <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md text-xs font-bold">
                                                  <Hand className="w-3 h-3" />
                                                  Sign to Text
                                             </span>
                                        )}
                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs font-mono">
                                            {Math.round((item.confidence || 0) * 100)}% Match
                                        </span>
                                    </div>
                                </div>
                                {item.id && (
                                    <button 
                                        onClick={() => deleteItem(item.id)}
                                        className="self-end md:self-auto p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg md:opacity-0 md:group-hover:opacity-100 transition-all"
                                        title="Delete record"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-16 text-center">
                        <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">No translations found</h3>
                        <p className="text-gray-400">Try adjusting your search, switching tabs, or start a new translation session.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
