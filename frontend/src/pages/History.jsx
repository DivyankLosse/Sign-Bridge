import React, { useState } from 'react';
import { useHistory } from '../hooks/useHistory';
import { useLearnTranscript } from '../hooks/useLearnTranscript';
import { Clock, Search, Trash2, Calendar, BookOpen } from 'lucide-react';

const History = () => {
    const { history, loading, deleteItem } = useHistory();
    const { transcripts } = useLearnTranscript();
    const [searchTerm, setSearchTerm] = useState('');

    const combinedHistory = [
        ...history.map(item => ({...item, type: 'translator'})),
        ...transcripts.map(item => ({...item, type: 'learn', created_at: item.timestamp, original_text: item.sign}))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const filteredHistory = combinedHistory.filter(item => 
        (item.predicted_text || item.original_text || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-5xl mx-auto animate-fade-in">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Clock className="text-primary" />
                    Translation History
                </h1>
                <p className="text-gray-400">Review and manage your past translation sessions.</p>
            </header>

            <div className="mb-8">
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
                ) : filteredHistory.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {filteredHistory.map((item) => (
                            <div key={item.id} className="p-6 hover:bg-white/5 transition-colors flex items-center justify-between group">
                                <div>
                                    <h3 className="text-xl font-medium text-white mb-1">
                                        {item.predicted_text || item.original_text}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(item.created_at).toLocaleString()}
                                        </span>
                                        {item.type === 'learn' && (
                                             <span className="flex items-center gap-1 bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md text-xs font-bold">
                                                  <BookOpen className="w-3 h-3" />
                                                  Learn Mode
                                             </span>
                                        )}
                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs font-mono">
                                            {Math.round((item.confidence || 0) * 100)}% Match
                                        </span>
                                    </div>
                                </div>
                                {item.type !== 'learn' && (
                                    <button 
                                        onClick={() => deleteItem(item.id)}
                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
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
                        <p className="text-gray-400">Try adjusting your search or start a new translation session.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
