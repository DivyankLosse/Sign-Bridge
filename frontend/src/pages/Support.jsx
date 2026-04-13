import React, { useState } from 'react';
import { LifeBuoy, Mail, MessageSquare, Send } from 'lucide-react';

import api from '../services/api';

const Support = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState({ type: null, message: '' });
    const [submitting, setSubmitting] = useState(false);

    const updateField = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setStatus({ type: null, message: '' });

        try {
            await api.post('/support', form);
            setStatus({
                type: 'success',
                message: 'Your message is on its way. We will get back to you shortly.',
            });
            setForm({ name: '', email: '', message: '' });
        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.detail || 'Unable to send your message right now.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto animate-fade-in">
            <header className="mb-10">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-primary">
                    <LifeBuoy className="h-4 w-4" />
                    Support
                </p>
                <h1 className="text-4xl font-bold text-white mb-3">Talk to the Sign Bridge team</h1>
                <p className="max-w-2xl text-gray-400 text-lg">
                    Share bugs, translation issues, or product questions. We keep the form simple and the reply loop fast.
                </p>
            </header>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                    <div className="grid gap-5 md:grid-cols-2">
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-gray-300">Name</span>
                            <input
                                value={form.name}
                                onChange={updateField('name')}
                                required
                                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary/50"
                                placeholder="Aarav Sharma"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-gray-300">Email</span>
                            <input
                                type="email"
                                value={form.email}
                                onChange={updateField('email')}
                                required
                                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-primary/50"
                                placeholder="you@example.com"
                            />
                        </label>
                    </div>

                    <label className="mt-5 block">
                        <span className="mb-2 block text-sm font-medium text-gray-300">Message</span>
                        <textarea
                            value={form.message}
                            onChange={updateField('message')}
                            required
                            rows={8}
                            className="w-full rounded-3xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition focus:border-primary/50"
                            placeholder="Tell us what happened, what you expected, and any page or device details that will help us reproduce it."
                        />
                    </label>

                    {status.message && (
                        <div
                            className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
                                status.type === 'success'
                                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                                    : 'border-rose-500/20 bg-rose-500/10 text-rose-300'
                            }`}
                        >
                            {status.message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="mt-6 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Send className="h-4 w-4" />
                        {submitting ? 'Sending...' : 'Send message'}
                    </button>
                </form>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary/15 via-white/5 to-transparent p-7">
                        <h2 className="text-xl font-semibold text-white mb-3">What to include</h2>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li>Which page or feature you were using</li>
                            <li>What you expected to happen</li>
                            <li>What actually happened instead</li>
                            <li>Any screenshots, browser, or device details</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-7">
                        <div className="flex items-center gap-3 text-white mb-4">
                            <Mail className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">Response style</h2>
                        </div>
                        <p className="text-sm leading-7 text-gray-400">
                            We use this inbox for product support, translation issues, and accessibility feedback. Messages are stored so the team can track and resolve them cleanly.
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gray-400">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Human response
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
