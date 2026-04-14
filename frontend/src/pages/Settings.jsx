import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { User, Settings as SettingsIcon, Globe, Palette, Save } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({ full_name: user?.full_name || '' });
    const [preferences, setPreferences] = useState({
        language: 'en-US',
        sign_language: 'asl',
        theme: 'dark',
        avatar_enabled: false
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchPrefs = async () => {
            try {
                const prefs = await userService.getPreferences();
                if (prefs) setPreferences(prefs);
            } catch {
                // Keep defaults if preferences cannot be loaded.
            }
        };
        fetchPrefs();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await userService.updateProfile(profile);
            await userService.updatePreferences(preferences);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch {
            setSaved(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in pb-24 md:pb-8">
            <header className="mb-10 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <SettingsIcon className="text-primary" />
                        Account Settings
                    </h1>
                    <p className="text-gray-400">Manage your profile, preferences, and display options.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-light disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium transition-all"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                    {saved ? "Saved!" : "Save Changes"}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" /> Profile
                    </h2>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                value={user?.email || ''} 
                                disabled
                                className="w-full bg-white/5 border border-transparent rounded-xl py-3 px-4 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                            <input 
                                type="text" 
                                value={profile.full_name}
                                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" /> Translation
                        </h2>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Primary Sign Language</label>
                                <select 
                                    value={preferences.sign_language}
                                    onChange={(e) => setPreferences({...preferences, sign_language: e.target.value})}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50"
                                >
                                    <option value="asl">American Sign Language (ASL)</option>
                                </select>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                <div>
                                    <h4 className="text-white font-medium">3D Avatar Representation</h4>
                                    <p className="text-sm text-gray-400">Show 3D avatar during translations</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={preferences.avatar_enabled}
                                        onChange={(e) => setPreferences({...preferences, avatar_enabled: e.target.checked})}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Palette className="w-5 h-5 text-primary" /> Display
                        </h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">App Theme</label>
                            <select 
                                value={preferences.theme}
                                onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary/50"
                            >
                                <option value="dark">Dark Mode (Default)</option>
                                <option value="light">Light Mode</option>
                                <option value="system">System Preference</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
