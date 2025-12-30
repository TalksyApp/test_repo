"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreHorizontal, ArrowLeft, Trash2, Smile, Camera, Heart, Reply, BellOff, Ban, X } from 'lucide-react';
import LiveBackground from "@/components/live-background";

// --- MOCK DATA TYPES ---
interface Contact {
    id: number;
    name: string;
    handle: string;
    avatar: string;
    status: string;
    lastMsg: string;
    time: string;
}

interface Message {
    id: string; // Changed to string for consistency
    sender: 'me' | 'them';
    text: string;
    time: string;
    isLiked?: boolean;
    replyTo?: string;
}

interface ChatHistory {
    [key: number]: Message[];
}

// --- MOCK CONTACTS ---
const CONTACTS: Contact[] = [
    { id: 1, name: "Design_God", handle: "@visuals", avatar: "D", status: "online", lastMsg: "Did you see the new layout?", time: "2m" },
    { id: 2, name: "Neon_Rider", handle: "@city", avatar: "N", status: "offline", lastMsg: "The grid is quiet tonight.", time: "1h" },
    { id: 3, name: "System_Bot", handle: "@void", avatar: "S", status: "online", lastMsg: "Welcome to Talksy Void.", time: "1d" },
];

// --- MOCK CHAT HISTORY (Updated IDs to strings) ---
const INITIAL_CHATS: ChatHistory = {
    1: [
        { id: "1", sender: "them", text: "Yo! The new profile update looks sick.", time: "10:00 AM" },
        { id: "2", sender: "me", text: "Thanks! I removed the follower counts.", time: "10:05 AM", isLiked: true },
        { id: "3", sender: "them", text: "Smart move. Pure vibes only.", time: "10:06 AM" },
    ],
    2: [
        { id: "1", sender: "them", text: "Raining again...", time: "8:00 PM" },
    ]
};

export default function MessagesPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [input, setInput] = useState("");
    const [chats, setChats] = useState<ChatHistory>(INITIAL_CHATS);

    // UI States
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
    const [showOptions, setShowOptions] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeContact = CONTACTS.find(c => c.id === selectedId);
    const activeMessages = selectedId ? (chats[selectedId] || []) : [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeMessages, selectedId]);

    const handleSend = () => {
        if (!input.trim() || !selectedId) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            sender: "me",
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            replyTo: replyingTo ? replyingTo.text : undefined
        };

        setChats(prev => ({
            ...prev,
            [selectedId]: [...(prev[selectedId] || []), newMsg]
        }));
        setInput("");
        setReplyingTo(null);
    };

    const handleDeleteMsg = (msgId: string) => {
        if (!selectedId) return;
        setChats(prev => ({
            ...prev,
            [selectedId]: prev[selectedId].filter(m => m.id !== msgId)
        }));
    };

    const handleLikeMsg = (msgId: string) => {
        if (!selectedId) return;
        setChats(prev => ({
            ...prev,
            [selectedId]: prev[selectedId].map(m => m.id === msgId ? { ...m, isLiked: !m.isLiked } : m)
        }));
    };

    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* --- LIVE BACKGROUND --- */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-black to-purple-900/10"></div>
                <LiveBackground />
            </div>

            <div className="md:max-w-[1600px] md:mx-auto md:pt-8 md:pb-8 md:px-6 relative z-10 h-full flex md:gap-6">

                {/* --- LEFT: CONTACT LIST --- */}
                <div className={`w-full h-full md:w-[380px] flex-shrink-0 flex flex-col bg-black md:bg-black/40 md:backdrop-blur-xl md:border border-white/5 rounded-none md:rounded-[32px] overflow-hidden ${selectedId ? 'hidden md:flex' : 'flex'}`}>

                    <div className="p-6 pb-4 pt-safe-top bg-black/50 backdrop-blur-md md:bg-transparent">
                        <h1 className="text-3xl font-black text-white mb-6 tracking-tight">Messages</h1>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={20} />
                            <input className="w-full bg-white/5 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none border border-white/5 focus:border-white/10 focus:bg-white/10 transition-all placeholder-gray-600 text-sm font-medium" placeholder="Search..." />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 pb-24 md:pb-4 flex flex-col gap-1">
                        {CONTACTS.map(contact => (
                            <div
                                key={contact.id}
                                onClick={() => setSelectedId(contact.id)}
                                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${selectedId === contact.id ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5'}`}
                            >
                                <div className="relative">
                                    <div className={`w-14 h-14 rounded-full border border-white/10 flex items-center justify-center font-bold text-xl text-white transition-transform ${selectedId === contact.id ? 'bg-gradient-to-br from-zinc-700 to-zinc-900 scale-105' : 'bg-[#18181b]'}`}>
                                        {contact.avatar}
                                    </div>
                                    {contact.status === 'online' && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-[#0a0a0a]"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className={`font-bold text-[17px] ${selectedId === contact.id ? 'text-white' : 'text-gray-200'}`}>{contact.name}</span>
                                        <span className="text-xs font-bold text-gray-600">{contact.time}</span>
                                    </div>
                                    <p className={`text-sm truncate ${selectedId === contact.id ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {contact.lastMsg}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- RIGHT: CHAT WINDOW --- */}
                <div className={`fixed inset-0 z-50 md:static md:flex-1 bg-[#050505] md:bg-black/60 md:backdrop-blur-2xl md:border border-white/5 rounded-none md:rounded-[32px] flex flex-col overflow-hidden ${!selectedId ? 'hidden md:flex' : 'flex'}`}>

                    {selectedId && activeContact ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl md:bg-transparent pt-safe-top md:pt-6 z-20 sticky top-0">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedId(null)} className="md:hidden w-10 h-10 -ml-2 text-zinc-400 hover:text-white flex items-center justify-center"><ArrowLeft size={24} /></button>

                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg md:text-xl shadow-lg">
                                        {activeContact.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg md:text-xl text-white leading-tight">{activeContact.name}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5 font-medium">
                                            {activeContact.status === 'online' ? 'Active now' : 'Active 1h ago'}
                                        </div>
                                    </div>
                                </div>

                                {/* Options Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowOptions(!showOptions)}
                                        className={`w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors ${showOptions ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        <MoreHorizontal size={20} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showOptions && (
                                        <div className="absolute right-0 top-12 w-48 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                                            <button
                                                onClick={() => { setIsMuted(!isMuted); setShowOptions(false) }}
                                                className="w-full text-left px-4 py-3 hover:bg-white/5 text-white text-sm font-medium flex items-center gap-2"
                                            >
                                                <BellOff size={16} className={isMuted ? "text-red-500" : "text-zinc-400"} />
                                                {isMuted ? "Unmute Messages" : "Mute Messages"}
                                            </button>
                                            <button className="w-full text-left px-4 py-3 hover:bg-white/5 text-white text-sm font-medium flex items-center gap-2">
                                                <Ban size={16} className="text-zinc-400" />
                                                Block User
                                            </button>
                                            <div className="h-px bg-white/5 w-full" />
                                            <button className="w-full text-left px-4 py-3 hover:bg-red-500/10 text-red-500 text-sm font-medium flex items-center gap-2">
                                                <Trash2 size={16} />
                                                Delete Chat
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#050505] md:bg-transparent scrollbar-hide">
                                {activeMessages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`group relative flex items-end gap-3 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                        onMouseEnter={() => setHoveredMessage(msg.id)}
                                        onMouseLeave={() => setHoveredMessage(null)}
                                    >

                                        {!msg.sender.includes('me') && (
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 border border-white/5">
                                                {activeContact.avatar}
                                            </div>
                                        )}

                                        {/* Hover Actions Menu (Floating Pill) */}
                                        <div className={`absolute -top-10 ${msg.sender === 'me' ? 'right-0' : 'left-10'} flex items-center gap-1.5 bg-black/80 backdrop-blur border border-white/10 rounded-full px-3 py-1.5 transition-all duration-200 z-10 ${hoveredMessage === msg.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                                            <button
                                                onClick={() => setReplyingTo(msg)}
                                                className="p-2 hover:text-indigo-400 text-zinc-400 transition-colors rounded-full hover:bg-white/5 active:scale-90" title="Reply"
                                            >
                                                <Reply size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleLikeMsg(msg.id)}
                                                className={`p-2 transition-colors rounded-full hover:bg-white/5 active:scale-90 ${msg.isLiked ? 'text-pink-500' : 'hover:text-pink-500 text-zinc-400'}`} title="Like"
                                            >
                                                <Heart size={18} fill={msg.isLiked ? "currentColor" : "none"} />
                                            </button>
                                            {msg.sender === 'me' && (
                                                <button onClick={() => handleDeleteMsg(msg.id)} className="p-2 hover:text-red-500 text-zinc-400 transition-colors rounded-full hover:bg-white/5 active:scale-90">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-1 max-w-[70%]">
                                            {/* Reply Context */}
                                            {msg.replyTo && (
                                                <div className={`text-xs mb-1 px-2 opacity-60 truncate border-l-2 ${msg.sender === 'me' ? 'border-indigo-500 text-right' : 'border-zinc-500 text-left'}`}>
                                                    Replying to: "{msg.replyTo}"
                                                </div>
                                            )}

                                            <div className={`relative px-5 py-3.5 text-[15px] shadow-sm break-words
                                                ${msg.sender === 'me'
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[22px] rounded-br-none md:rounded-br-sm shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                                                    : 'bg-white/5 backdrop-blur-md text-white rounded-[22px] rounded-bl-sm border border-white/10'
                                                }`}>
                                                {msg.text}
                                                <div className={`text-[9px] mt-1 font-medium flex items-center gap-1 justify-end opacity-70 ${msg.sender === 'me' ? 'text-indigo-100' : 'text-zinc-400'}`}>
                                                    {msg.time}
                                                    {msg.isLiked && <Heart size={10} className="fill-pink-500 text-pink-500 ml-1" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-3 pb-[env(safe-area-inset-bottom)] md:p-6 bg-[#050505] md:bg-transparent border-t border-white/5">

                                {/* Replying Indicator */}
                                {replyingTo && (
                                    <div className="flex items-center justify-between bg-white/5 rounded-t-2xl px-4 py-2 border-b border-white/5 mb-[-1px] animate-in slide-in-from-bottom-2 mx-1 md:mx-0">
                                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                                            <Reply size={14} className="scale-x-[-1]" />
                                            <span>Replying to <span className="text-white font-bold">{replyingTo.sender === 'me' ? "Yourself" : activeContact.name}</span></span>
                                        </div>
                                        <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}

                                <div className={`flex items-center gap-3 relative z-10 p-1 pl-4 md:pl-4 bg-[#121212] md:bg-[#0a0a0a]/60 border border-white/10 rounded-[28px] ${replyingTo ? 'rounded-t-none' : ''} shadow-lg md:p-1.5`}>

                                    {/* Desktop Camera (Hidden on Mobile) */}
                                    <div className="hidden md:flex w-10 h-10 rounded-full bg-white/5 items-center justify-center text-zinc-400 cursor-pointer hover:bg-white/10 hover:text-white transition-all">
                                        <Camera size={20} />
                                    </div>

                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder={replyingTo ? "Type your reply..." : "Message..."}
                                        className="flex-1 bg-transparent text-[16px] md:text-[15px] text-white outline-none py-3 placeholder-zinc-500"
                                        autoFocus={!!replyingTo}
                                    />

                                    {/* Send / Smile Logic */}
                                    {input.trim() ? (
                                        <button
                                            onClick={handleSend}
                                            className={`w-[42px] h-[42px] md:w-[46px] md:h-[46px] rounded-full flex items-center justify-center transition-all duration-300 shrink-0 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:scale-105 active:scale-95`}
                                        >
                                            <Send size={18} className="translate-x-0.5" fill="currentColor" />
                                        </button>
                                    ) : (
                                        <>
                                            {/* Mobile: Dimmed Send Button */}
                                            <button
                                                disabled
                                                className="md:hidden w-[42px] h-[42px] rounded-full flex items-center justify-center border border-transparent bg-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed"
                                            >
                                                <Send size={18} fill="currentColor" />
                                            </button>

                                            {/* Desktop: Smile Icon */}
                                            <div className="hidden md:flex gap-2 pr-3 text-zinc-500">
                                                <Smile size={22} className="hover:text-white cursor-pointer transition-colors" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        // Empty State (Desktop only)
                        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-500">
                            <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center mb-6 animate-pulse bg-white/5">
                                <Send size={40} className="text-white/20" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Your Messages</h2>
                            <p className="text-zinc-500">Select a conversation to start chatting.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
