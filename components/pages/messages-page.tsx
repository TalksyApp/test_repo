"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, ArrowLeft, Trash2, Smile, Camera } from 'lucide-react';
import LiveBackground from "@/components/live-background";

// --- MOCK CONTACTS ---
interface Contact {
    id: number;
    name: string;
    handle: string;
    avatar: string;
    status: string;
    lastMsg: string;
    time: string;
}

const CONTACTS: Contact[] = [
    { id: 1, name: "Design_God", handle: "@visuals", avatar: "D", status: "online", lastMsg: "Did you see the new layout?", time: "2m" },
    { id: 2, name: "Neon_Rider", handle: "@city", avatar: "N", status: "offline", lastMsg: "The grid is quiet tonight.", time: "1h" },
    { id: 3, name: "System_Bot", handle: "@void", avatar: "S", status: "online", lastMsg: "Welcome to Talksy Void.", time: "1d" },
];

// --- MOCK CHAT HISTORY ---
interface Message {
    id: number;
    sender: 'me' | 'them';
    text: string;
    time: string;
}

interface ChatHistory {
    [key: number]: Message[];
}

const INITIAL_CHATS: ChatHistory = {
    1: [
        { id: 1, sender: "them", text: "Yo! The new profile update looks sick.", time: "10:00 AM" },
        { id: 2, sender: "me", text: "Thanks! I removed the follower counts.", time: "10:05 AM" },
        { id: 3, sender: "them", text: "Smart move. Pure vibes only.", time: "10:06 AM" },
    ],
    2: [
        { id: 1, sender: "them", text: "Raining again...", time: "8:00 PM" },
    ]
};

export default function MessagesPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [input, setInput] = useState("");
    const [chats, setChats] = useState<ChatHistory>(INITIAL_CHATS);
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

        const newMsg: Message = { id: Date.now(), sender: "me", text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };

        setChats(prev => ({
            ...prev,
            [selectedId]: [...(prev[selectedId] || []), newMsg]
        }));
        setInput("");
    };

    const handleDeleteMsg = (msgId: number) => {
        if (!selectedId) return;
        setChats(prev => ({
            ...prev,
            [selectedId]: prev[selectedId].filter(m => m.id !== msgId)
        }));
    };

    return (
        <div className="w-full h-full relative overflow-hidden">
            {/* --- LIVE BACKGROUND --- */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-purple-900/20"></div>
                <LiveBackground />
            </div>

            <div className="md:max-w-[1600px] md:mx-auto md:pt-8 md:pb-8 md:px-6 relative z-10 h-full flex md:gap-6">

                {/* --- LEFT: CONTACT LIST --- */}
                <div className={`w-full h-full md:w-[380px] flex-shrink-0 flex flex-col bg-black md:bg-black/20 md:backdrop-blur-2xl md:border border-white/10 rounded-none md:rounded-[32px] overflow-hidden ${selectedId ? 'hidden md:flex' : 'flex'}`}>

                    <div className="p-6 pb-4 pt-safe-top bg-black/50 backdrop-blur-md md:bg-transparent">
                        <h1 className="text-3xl font-black text-white mb-6">Messages</h1>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={20} />
                            <input className="w-full bg-white/5 text-white pl-12 pr-4 py-4 rounded-2xl outline-none border border-white/5 focus:border-white/20 transition-all placeholder-gray-600 text-lg" placeholder="Search..." />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 pb-24 md:pb-4 flex flex-col gap-1">
                        {CONTACTS.map(contact => (
                            <div
                                key={contact.id}
                                onClick={() => setSelectedId(contact.id)}
                                className={`p-4 rounded-3xl cursor-pointer transition-all flex items-center gap-4 ${selectedId === contact.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                            >
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full bg-[#18181b] border border-white/10 flex items-center justify-center font-bold text-xl text-white">
                                        {contact.avatar}
                                    </div>
                                    {contact.status === 'online' && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0a0a0a]"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`font-bold text-lg ${selectedId === contact.id ? 'text-white' : 'text-gray-200'}`}>{contact.name}</span>
                                        <span className="text-xs text-gray-600">{contact.time}</span>
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
                <div className={`fixed inset-0 z-50 md:static md:flex-1 bg-[#050505] md:bg-black/20 md:backdrop-blur-2xl md:border border-white/10 rounded-none md:rounded-[32px] flex flex-col overflow-hidden ${!selectedId ? 'hidden md:flex' : 'flex'}`}>

                    {selectedId && activeContact ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl md:bg-transparent pt-safe-top md:pt-6">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedId(null)} className="md:hidden w-10 h-10 -ml-2 text-zinc-400 hover:text-white flex items-center justify-center"><ArrowLeft size={24} /></button>

                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg md:text-xl shadow-lg">
                                        {activeContact.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg md:text-xl text-white leading-tight">{activeContact.name}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                                            {activeContact.status === 'online' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>}
                                            {activeContact.handle}
                                        </div>
                                    </div>
                                </div>
                                <button className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-3 bg-[#050505] md:bg-transparent">
                                {activeMessages.map(msg => (
                                    <div key={msg.id} className={`group flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>

                                        {/* Delete Action (Mobile tap or Desktop hover) */}
                                        {msg.sender === 'me' && (
                                            <button
                                                onClick={() => handleDeleteMsg(msg.id)}
                                                className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 p-2 rounded-full hover:bg-white/5"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}

                                        <div className={`max-w-[75%] px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm break-words relative ${msg.sender === 'me'
                                            ? 'bg-indigo-600 text-white rounded-br-none md:rounded-br-md'
                                            : 'bg-[#1f1f22] text-white rounded-bl-none md:rounded-bl-md border border-white/5'
                                            }`}>
                                            {msg.text}
                                            <div className={`text-[9px] mt-1 text-right font-medium tracking-wide opacity-60 ${msg.sender === 'me' ? 'text-indigo-200' : 'text-zinc-500'}`}>
                                                {msg.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-3 pb-[env(safe-area-inset-bottom)] md:p-5 bg-[#050505] md:bg-transparent border-t border-white/5">
                                <div className="p-1 pl-4 md:pl-4 bg-[#121212] md:bg-[#0a0a0a]/60 border border-white/10 rounded-full flex items-center shadow-lg md:p-2 gap-2">

                                    {/* Desktop Camera & Import (Hidden on Mobile) */}
                                    <div className="hidden md:flex w-10 h-10 rounded-full bg-indigo-500/10 items-center justify-center text-indigo-400 cursor-pointer hover:bg-indigo-500 hover:text-white transition-all">
                                        <Camera size={20} />
                                    </div>

                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Message..."
                                        className="flex-1 bg-transparent text-[16px] md:text-lg text-white outline-none py-3 placeholder-gray-500"
                                    />

                                    {/* Send / Smile Logic */}
                                    {input.trim() ? (
                                        <button
                                            onClick={handleSend}
                                            className={`w-[46px] h-[46px] md:w-auto md:h-auto md:px-6 md:py-2.5 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 m-0.5 md:m-0 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] hover:scale-110 active:scale-95 transform`}
                                        >
                                            <Send size={20} className="md:hidden translate-x-0.5" fill="currentColor" />
                                            <span className="hidden md:inline font-bold text-sm">Send</span>
                                        </button>
                                    ) : (
                                        <>
                                            {/* Mobile: Dimmed Send Button */}
                                            <button
                                                disabled
                                                className="md:hidden w-[46px] h-[46px] rounded-full flex items-center justify-center border border-transparent bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] opacity-50 grayscale cursor-not-allowed"
                                            >
                                                <Send size={20} fill="currentColor" />
                                            </button>

                                            {/* Desktop: Smile Icon */}
                                            <div className="hidden md:flex gap-2 pr-2 text-gray-500">
                                                <Smile size={24} className="hover:text-white cursor-pointer transition-colors" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        // Empty State (Desktop only)
                        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-500">
                            <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Send size={40} className="text-white/20" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Your Messages</h2>
                            <p className="text-gray-500">Select a conversation to start chatting.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
