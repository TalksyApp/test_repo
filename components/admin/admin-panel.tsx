"use client"

import React, { useState } from 'react';
import { Shield, Users, FileText, AlertTriangle, Zap, Check, X, Megaphone, Trash2 } from 'lucide-react';
import { storage } from "@/lib/storage";

interface AdminPageProps {
    currentUser: any;
    onNavigate: (page: string) => void;
}

export default function AdminPage({ currentUser, onNavigate }: AdminPageProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'ads'>('overview');

    // Auth Check
    if (currentUser?.email !== 'admin@talksy.app') {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <Shield size={64} className="text-red-500 mb-4" />
                <h1 className="text-3xl font-black text-white">ACCESS DENIED</h1>
                <p className="text-gray-500">Your frequency is not authorized for this sector.</p>
                <button
                    onClick={() => onNavigate('feed')}
                    className="bg-white text-black px-6 py-2 rounded-full font-bold mt-4 hover:scale-105 transition-transform"
                >
                    Return to Feed
                </button>
            </div>
        );
    }

    // Mock Data
    const stats = {
        users: 1240,
        posts: 8503,
        reports: 12,
        activeAds: 1
    };

    const reports = [
        { id: 1, type: "Spam", content: "Buy crypto now!!!", reporter: "@user123", status: "pending" },
        { id: 2, type: "Harassment", content: "You are [redacted]...", reporter: "@peace_walker", status: "pending" },
    ];

    return (
        <div className="max-w-4xl mx-auto pt-10 pb-32 px-6">
            <div className="mb-10">
                <h1 className="text-5xl font-display font-black text-white mb-2 tracking-tight flex items-center gap-3">
                    <Shield size={40} className="text-yellow-500" />
                    Command Center
                </h1>
                <p className="text-gray-500 text-lg font-medium">System administration and moderation protocols.</p>
            </div>

            {/* TABS */}
            <div className="flex gap-4 mb-8 border-b border-white/10 pb-1">
                <TabButton label="Overview" icon={Zap} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                <TabButton label="Reports" icon={AlertTriangle} active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} count={reports.length} />
                <TabButton label="Ad Network" icon={Megaphone} active={activeTab === 'ads'} onClick={() => setActiveTab('ads')} />
            </div>

            {/* CONTENT */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* 1. OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard label="Total Users" value={stats.users.toLocaleString()} icon={Users} />
                        <StatCard label="Total Transmissions" value={stats.posts.toLocaleString()} icon={FileText} />
                        <StatCard label="Pending Reports" value={stats.reports} icon={AlertTriangle} color="text-yellow-500" />
                        <StatCard label="Active Ad Campaigns" value={stats.activeAds} icon={Megaphone} color="text-green-500" />
                    </div>
                )}

                {/* 2. REPORTS */}
                {activeTab === 'reports' && (
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <div key={report.id} className="bg-[#111] border border-white/10 p-5 rounded-xl flex items-center justify-between group hover:border-white/20 transition-all">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">{report.type}</span>
                                        <span className="text-gray-500 text-xs">Reported by {report.reporter}</span>
                                    </div>
                                    <p className="text-white font-medium text-sm">"{report.content}"</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 flex items-center justify-center transition-all" title="Delete Content">
                                        <Trash2 size={16} />
                                    </button>
                                    <button className="w-9 h-9 rounded-full bg-white/5 hover:bg-green-500/20 text-gray-400 hover:text-green-400 flex items-center justify-center transition-all" title="Dismiss">
                                        <Check size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 3. ADS */}
                {activeTab === 'ads' && (
                    <div className="bg-[#111] border border-white/10 p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">Global Ad Injection</h3>
                                <p className="text-gray-500 text-sm">Control the frequency of sponsored signals in the feed.</p>
                            </div>
                            <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                SYSTEM ACTIVE
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-black/30 p-4 rounded-xl border border-white/5">
                                <div>
                                    <div className="text-white font-bold">In-Feed Sponsored Cards</div>
                                    <div className="text-gray-500 text-sm">Frequency: Every 5 posts</div>
                                </div>
                                <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform">
                                    Manage
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

// --- HELPERS ---

const TabButton = ({ label, icon: Icon, active, onClick, count }: any) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${active ? 'border-yellow-500 text-white' : 'border-transparent text-gray-500 hover:text-white'}`}
    >
        <Icon size={16} />
        <span className="font-bold text-sm tracking-wide">{label}</span>
        {count && <span className="bg-white/10 text-white px-1.5 rounded text-[10px]">{count}</span>}
    </button>
);

const StatCard = ({ label, value, icon: Icon, color = "text-white" }: any) => (
    <div className="bg-[#111] border border-white/10 p-5 rounded-2xl hover:border-white/20 transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                <Icon size={20} />
            </div>
        </div>
        <div className="text-3xl font-black text-white mb-1 tracking-tight">{value}</div>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</div>
    </div>
);
