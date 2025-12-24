"use client"

import React, { useState, useEffect } from 'react';
import { X, Zap, Minimize2, Maximize2 } from 'lucide-react';
import { useBackground } from './background-provider';

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPost: (text: string, tags: string[], options: { isBoosted: boolean }) => void;
}

export default function CreateModal({ isOpen, onClose, onPost }: CreateModalProps) {
    const { composerMode } = useBackground();
    const [text, setText] = useState("");
    const [isBoosted, setIsBoosted] = useState(false);

    // Internal mode state to allow on-the-fly toggling without changing global setting
    const [activeMode, setActiveMode] = useState<'focus' | 'quick'>('focus');

    // Sync active mode with global preference when modal opens
    useEffect(() => {
        if (isOpen) {
            // Default to Quick Mode on mobile for better keyboard experience
            if (window.innerWidth < 768) {
                setActiveMode('quick');
            } else {
                setActiveMode(composerMode);
            }
        }
    }, [isOpen, composerMode]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (text.trim()) {
            onPost(text, [], { isBoosted });
            setText("");
            setIsBoosted(false);
            onClose();
            // Reset mode to global default on close
            setActiveMode(composerMode);
        }
    };

    // --- MODE STYLES ---
    const isQuick = activeMode === 'quick';

    // Focus Mode: Full Screen Overlay
    // Quick Mode: Bottom Right Popup (No Backdrop)
    const containerClasses = isQuick
        ? "fixed bottom-0 left-0 right-0 md:bottom-24 md:right-8 md:w-[400px] md:left-auto z-[200] animate-in slide-in-from-bottom-10 fade-in duration-300 pointer-events-auto"
        : "fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200";

    const cardClasses = isQuick
        ? `bg-[#0a0a0a] w-full rounded-t-3xl md:rounded-2xl border transition-all duration-500 p-5 relative shadow-2xl ${isBoosted ? 'border-yellow-500/50 shadow-[0_0_60px_rgba(234,179,8,0.2)]' : 'border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]'}`
        : `bg-[#0a0a0a] w-full max-w-4xl rounded-t-3xl md:rounded-3xl border transition-all duration-500 p-6 md:p-8 relative shadow-2xl pb-[env(safe-area-inset-bottom)] ${isBoosted ? 'border-yellow-500/50 shadow-[0_0_80px_rgba(234,179,8,0.2)]' : 'border-white/10 shadow-2xl shadow-black/50'} mb-0 md:mb-auto`;


    return (
        <div className={isQuick ? "fixed inset-0 z-[200] pointer-events-none" : containerClasses}>

            {/* The Modal Card */}
            <div className={isQuick ? containerClasses : ""}>
                <div className={cardClasses}>

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col">
                            <h2 className={`font-black tracking-tight flex items-center gap-2 transition-colors ${isQuick ? 'text-lg' : 'text-3xl'} ${isBoosted ? 'text-yellow-400' : 'text-white'}`}>
                                {isBoosted ? 'PRIORITY BROADCAST' : 'BROADCAST'}
                            </h2>
                            {!isQuick && (
                                <p className="text-sm text-gray-500 font-medium tracking-wide">
                                    {isBoosted ? 'High visibility across the network' : 'Share your frequency with the void'}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* MINIMIZE / MAXIMIZE BUTTON */}
                            <button
                                onClick={() => setActiveMode(isQuick ? 'focus' : 'quick')}
                                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all pointer-events-auto"
                                title={isQuick ? "Expand" : "Minimize"}
                            >
                                {isQuick ? <Maximize2 size={16} /> : <Minimize2 size={18} />}
                            </button>

                            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all pointer-events-auto">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Main Input */}
                    <div className="flex gap-4 mb-2">
                        {/* Avatar (Hidden in Quick Mode to save space) */}
                        {!isQuick && (
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 transition-all duration-500 border ${isBoosted ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-[#18181b] border-white/10'}`}>
                                Y
                            </div>
                        )}

                        <div className="flex-1">
                            <textarea
                                autoFocus
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="What is happening in the void?"
                                className={`w-full bg-transparent text-white placeholder-gray-600 outline-none resize-none border-none p-0 leading-relaxed font-medium ${isQuick ? 'h-24 text-lg' : 'h-32 text-xl'}`}
                            />
                        </div>
                    </div>

                    {/* Footer Toolbar */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                        <div className="flex gap-2 text-gray-500">
                            {/* BOOST TOGGLE */}
                            <button
                                onClick={() => setIsBoosted(!isBoosted)}
                                className={`h-9 px-4 rounded-full flex items-center gap-2 transition-all font-bold text-xs tracking-wide pointer-events-auto ${isBoosted ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                title="Boost Visibility"
                            >
                                <Zap size={14} fill={isBoosted ? "currentColor" : "none"} />
                                {isBoosted ? 'BOOST ACTIVE' : 'Boost'}
                            </button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!text.trim()}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all pointer-events-auto ${text.trim() ? 'bg-white text-black hover:scale-105 shadow-lg' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                        >
                            Post
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
