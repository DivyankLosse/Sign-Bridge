import React from 'react';
import TopNavbar from '../components/TopNavbar';

const History = () => {
    return (
        <>
            <TopNavbar title="Translation History" />
            <section className="p-8 max-w-7xl mx-auto w-full">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card p-6 rounded-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-primary/10"></div>
                        <p className="text-on-surface-variant text-sm font-medium mb-1">Total Translations</p>
                        <h3 className="text-4xl font-bold header-anchor">1,284</h3>
                        <div className="mt-4 flex items-center text-xs text-primary font-bold">
                            <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                            +12% from last month
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-secondary/10"></div>
                        <p className="text-on-surface-variant text-sm font-medium mb-1">Avg. Confidence</p>
                        <h3 className="text-4xl font-bold header-anchor">98.2%</h3>
                        <div className="mt-4 flex items-center text-xs text-on-surface-variant">
                            High-fidelity AI mapping
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-tertiary/10"></div>
                        <p className="text-on-surface-variant text-sm font-medium mb-1">Top Language</p>
                        <h3 className="text-4xl font-bold header-anchor">ASL</h3>
                        <div className="mt-4 flex items-center text-xs text-on-surface-variant">
                            American Sign Language
                        </div>
                    </div>
                </div>

                {/* History Table */}
                <div className="glass-card rounded-lg overflow-hidden border border-white/5 shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-8 py-5 text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">Input (Text/Sign)</th>
                                    <th className="px-8 py-5 text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">Output (Sign/Text)</th>
                                    <th className="px-8 py-5 text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">Confidence</th>
                                    <th className="px-8 py-5 text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">Timestamp</th>
                                    <th className="px-8 py-5 text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
                                                <span className="material-symbols-outlined text-sm text-primary">keyboard</span>
                                            </div>
                                            <span className="font-medium text-on-surface">"How can I help you today?"</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                                <img alt="Sign Preview" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0anGijA13Ox7XvhJc_0nISFvHAp-P7Xiz3vbk7Zs7CWD7I9JmbyG3F-JfDShtoaWfj1JXAHNh7bky3szEvu_ax_yF9VqZzwwRUsTtnOEiDRWSbTg-bM4DWSWbQ0DWfYKR88Pkx5mVrumD37SxEh0eDfYHtqR1hbDA_IRp1EVF4E_d7542MloFzqAcFVS5xmvK8U5a3h9JxLzuWN3F_DRgyDwHaFoGRoog0d1A9S4jTuNs5G0PxcyJxFsc-8gzGvK2BGoaQbcriRr4"/>
                                            </div>
                                            <span className="text-sm text-on-surface-variant">ASL Visual Sequence</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                                                <div className="w-[99%] h-full bg-primary"></div>
                                            </div>
                                            <span className="text-xs font-bold text-primary">99%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-on-surface-variant/70">Oct 24, 14:20</td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                                <img alt="Camera Input" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2vAk13vekW8VdBYhpj0jX3YjMsi-aQrBj6UJPUiVV0oW_6lky-yQ_Wv-8C1rJUig99zM0XUyXITwkj_Oq4V-2PuYRfl4VXkTmpLLTbZsipe6ccNukg_MKwvQMGNRLKo2rlPLBS_2eT4zo4Bv_H8YzFg0fx9VWQagqohZhan9a-5IlHIwxWZrdRUMI0rDR5sB1xdnOhkCjCHJWqBklkk62fkhz_k8H6-2ce7D3SVUET6G88vGBx5ygXrpyVPakdeJl-UfCkthBzfDM"/>
                                            </div>
                                            <span className="text-sm text-on-surface-variant">Camera Feed #402</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center">
                                                <span className="material-symbols-outlined text-sm text-secondary">description</span>
                                            </div>
                                            <span className="font-medium text-on-surface">"Where is the library?"</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                                                <div className="w-[94%] h-full bg-secondary"></div>
                                            </div>
                                            <span className="text-xs font-bold text-secondary">94%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-on-surface-variant/70">Oct 24, 12:45</td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );
};

export default History;
