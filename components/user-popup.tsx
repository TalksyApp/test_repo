"use client"

import React from 'react';
import { X, MapPin, User, Languages, MessageCircle, UserPlus, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';

interface UserPopupProps {
    user: any; // Using any for now to match provided usage, can be refined later
    onClose: () => void;
    onNavigateToMessages?: () => void;
    onViewProfile?: () => void;
}

const USER_DETAILS: Record<string, { bio: string; city: string; gender: string; lang: string }> = {
    "Design_God": { bio: "Obsessed with pixels and dark mode.", city: "Berlin, DE", gender: "Male", lang: "German" },
    "CodeNinja": { bio: "I dream in JavaScript.", city: "SF, USA", gender: "Female", lang: "English" },
    "Minimalist": { bio: "Less is more.", city: "Tokyo, JP", gender: "NB", lang: "Japanese" },
    "Neon_Rider": { bio: "Chasing the synthwave sunset.", city: "Miami, USA", gender: "Male", lang: "Spanish" },
    "You": { bio: "Developer. Dreamer.", city: "Patna, IN", gender: "Male", lang: "Hindi" }
};

export default function UserPopup({ user, onClose, onNavigateToMessages, onViewProfile }: UserPopupProps) {
    if (!user) return null;

    const details = USER_DETAILS[user.author] || { bio: "Traveler of the void.", city: "Unknown", gender: "Unknown", lang: "Universal" };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>

            <div
                className="bg-[#09090b] w-full max-w-sm rounded-[32px] border border-white/10 p-1 relative shadow-2xl transform transition-all scale-100 overflow-hidden"
                onClick={e => e.stopPropagation()}
            >

                {/* Inner Content */}
                <div className="bg-[#121214] rounded-[28px] relative overflow-hidden h-full flex flex-col">

                    {/* Banner */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"></div>

                    {/* Close Button */}
                    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all z-20 text-white border border-white/10">
                        <X size={16} />
                    </button>

                    {/* Avatar & Header */}
                    <div className="flex flex-col items-center text-center mt-12 relative z-10 px-6">
                        <div className="w-24 h-24 rounded-full bg-[#121214] border-[4px] border-[#121214] flex items-center justify-center text-white font-bold text-4xl shadow-2xl relative">
                            {user.avatar}
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-[#121214] rounded-full"></div>
                        </div>

                        <div className="mt-3">
                            <h2 className="text-2xl font-black text-white flex items-center gap-1.5 justify-center">
                                {user.author}
                                <CheckCircle size={18} className="text-blue-500" fill="white" color="#3b82f6" />
                            </h2>
                            <p className="text-zinc-500 text-sm font-medium">@{user.handle || user.author.toLowerCase().replace(' ', '_')}</p>
                        </div>

                        {/* Bio */}
                        <div className="mt-4 mb-6">
                            <p className="text-zinc-300 text-[15px] leading-relaxed font-medium">"{details.bio}"</p>
                        </div>

                        {/* Tags */}
                        <div className="flex justify-center gap-2 flex-wrap mb-8">
                            <div className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                                <MapPin size={12} className="text-indigo-400" /> {details.city}
                            </div>
                            <div className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                                <Languages size={12} className="text-pink-400" /> {details.lang}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-[#09090b]/50 border-t border-white/5 p-4 space-y-3 mt-auto backdrop-blur-sm">
                        <div className="flex gap-3">
                            <button className="flex-1 bg-white text-black py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-white/5">
                                <UserPlus size={16} /> Connect
                            </button>
                            <button
                                onClick={onNavigateToMessages}
                                className="flex-1 bg-[#27272a] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#3f3f46] transition-all flex items-center justify-center gap-2 border border-white/5"
                            >
                                <MessageCircle size={16} /> Message
                            </button>
                        </div>

                        {onViewProfile && (
                            <button
                                onClick={onViewProfile}
                                className="w-full py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold flex items-center justify-center gap-2 group"
                            >
                                View Full Profile <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
