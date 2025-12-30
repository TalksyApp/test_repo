"use client"

import { useState, useEffect, useRef } from "react"
import { X, Search, Camera, Smile, Send, Trash2, ArrowLeft, MoreHorizontal, Heart, Reply, BellOff, Ban } from "lucide-react"
import type { User } from "@/lib/storage"

interface MessagesOverlayProps {
  currentUser: User
  onClose: () => void
}

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: Date
  isMe: boolean
  likes?: number
  isLiked?: boolean
  replyTo?: string
}

interface ChatUser {
  id: string
  username: string
  handle: string
  avatar_initials: string
  status: "online" | "offline"
  lastMessage: string
  lastMessageTime: string
  color: string
}

export default function MessagesOverlay({ currentUser, onClose }: MessagesOverlayProps) {
  // Mobile: Start with null (List View)
  const [activeChat, setActiveChat] = useState<string | null>(null)

  const [messageInput, setMessageInput] = useState("")
  // Interaction States
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "1",
      text: "Yo! The new profile update looks sick.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      isMe: false,
    },
    {
      id: "2",
      senderId: "me",
      text: "Thanks! I removed the follower counts.",
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
      isMe: true,
      isLiked: true
    },
    {
      id: "3",
      senderId: "1",
      text: "Smart move. Pure vibes only.",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      isMe: false,
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // --- Handlers ---
  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }

  const handleLikeMessage = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isLiked: !m.isLiked } : m))
  }

  // --- Mock Users ---
  const users: ChatUser[] = [
    {
      id: "1",
      username: "Design_God",
      handle: "@visuals_online",
      avatar_initials: "D",
      status: "online",
      lastMessage: "Did you see the new layout?",
      lastMessageTime: "2m",
      color: "bg-purple-600",
    },
    {
      id: "2",
      username: "Neon_Rider",
      handle: "@neon_rider",
      avatar_initials: "N",
      status: "offline",
      lastMessage: "The grid is quiet tonight.",
      lastMessageTime: "1h",
      color: "bg-blue-600",
    },
    {
      id: "3",
      username: "System_Bot",
      handle: "@sys_bot",
      avatar_initials: "S",
      status: "online",
      lastMessage: "Welcome to Talksy Void.",
      lastMessageTime: "1d",
      color: "bg-green-600",
    },
  ]

  const activeUser = users.find((u) => u.id === activeChat)

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!messageInput.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      text: messageInput,
      timestamp: new Date(),
      isMe: true,
      replyTo: replyingTo ? replyingTo.text : undefined
    }

    setMessages([...messages, newMessage])
    setMessageInput("")
    setReplyingTo(null) // Clear reply state
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center md:p-8 animate-in fade-in duration-300">

      {/* Glossy Container */}
      <div className="bg-[#050505] md:bg-black/80 md:backdrop-blur-2xl border border-white/5 w-full max-w-6xl h-full md:h-[85vh] rounded-none md:rounded-[32px] flex overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">

        {/* --- Sidebar (Refined Glass) --- 
            Mobile Logic: Hidden if chat is active. Visible if chat is NOT active.
        */}
        <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-[350px] border-r border-white/5 flex-col bg-black/40 backdrop-blur-xl relative z-10`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight">Messages</h2>
              {/* Close Button (Visible on Mobile List View) */}
              <button onClick={onClose} className="md:hidden p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:bg-white/10 focus:border-white/10 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 space-y-1">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setActiveChat(user.id)}
                className={`p-3 rounded-2xl flex items-center gap-4 cursor-pointer transition-all duration-300 group ${activeChat === user.id ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5'}`}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-transform duration-300 ${activeChat === user.id ? 'scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'group-hover:scale-105'} bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10`}>
                    {user.avatar_initials}
                  </div>
                  {user.status === "online" && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-[#0a0a0a]"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className={`font-bold text-[15px] truncate ${activeChat === user.id ? 'text-white' : 'text-zinc-300'}`}>{user.username}</h3>
                    <span className="text-[11px] font-bold text-zinc-600">{user.lastMessageTime}</span>
                  </div>
                  <p className={`text-sm truncate ${activeChat === user.id ? 'text-zinc-300' : 'text-zinc-500'}`}>{user.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Chat Area (Deep Void) --- 
            Mobile Logic: Hidden if NO chat is active. Visible if chat IS active.
        */}
        <div className={`${!activeChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-[#020202] relative w-full`}>

          {activeUser ? (
            <>
              {/* Header */}
              <div className="p-4 md:px-8 md:py-5 border-b border-white/5 flex items-center justify-between z-20 bg-[#020202]/80 backdrop-blur-md sticky top-0">
                <div className="flex items-center gap-4">
                  {/* Back Button (Mobile Only) */}
                  <button
                    onClick={() => setActiveChat(null)}
                    className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white"
                  >
                    <ArrowLeft size={24} />
                  </button>

                  <div className="relative">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg`}>
                      {activeUser?.avatar_initials}
                    </div>
                    {activeUser?.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white leading-tight">{activeUser?.username}</h3>
                    <p className="text-xs text-zinc-500 font-medium">
                      {userStatusText(activeUser?.status)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Options Menu Toggle */}
                  <div className="relative">
                    <button
                      onClick={() => setShowOptions(!showOptions)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showOptions ? 'bg-white text-black' : 'hover:bg-white/10 text-white'}`}
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

                  {/* Desktop Close Button (Unchanged) */}
                  <button
                    onClick={onClose}
                    className="hidden md:flex w-8 h-8 rounded-full bg-white/5 items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`group relative flex items-end gap-3 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    onMouseEnter={() => setHoveredMessage(msg.id)}
                    onMouseLeave={() => setHoveredMessage(null)}
                  >
                    {!msg.isMe && (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 border border-white/5">
                        {activeUser?.avatar_initials}
                      </div>
                    )}

                    {/* Hover Actions Menu (Floating Pill) WITH BIGGER ICONS */}
                    <div className={`absolute -top-10 ${msg.isMe ? 'right-0' : 'left-10'} flex items-center gap-1.5 bg-black/80 backdrop-blur border border-white/10 rounded-full px-3 py-1.5 transition-all duration-200 z-20 ${hoveredMessage === msg.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="p-2 hover:text-indigo-400 text-zinc-400 transition-colors rounded-full hover:bg-white/5 active:scale-90" title="Reply"
                      >
                        <Reply size={18} />
                      </button>
                      <button
                        onClick={() => handleLikeMessage(msg.id)}
                        className={`p-2 transition-colors rounded-full hover:bg-white/5 active:scale-90 ${msg.isLiked ? 'text-pink-500' : 'hover:text-pink-500 text-zinc-400'}`} title="Like"
                      >
                        <Heart size={18} fill={msg.isLiked ? "currentColor" : "none"} />
                      </button>
                      <button className="p-2 hover:text-white text-zinc-400 transition-colors rounded-full hover:bg-white/5 active:scale-90">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-1 max-w-[70%]">
                      {/* Reply Context */}
                      {msg.replyTo && (
                        <div className={`text-xs mb-1 px-2 opacity-60 truncate border-l-2 ${msg.isMe ? 'border-indigo-500 text-right' : 'border-zinc-500 text-left'}`}>
                          Replying to: "{msg.replyTo}"
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={`relative px-5 py-3.5 text-[15px] shadow-sm
                        ${msg.isMe
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[22px] rounded-br-sm shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                            : 'bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-[22px] rounded-bl-sm'
                          }`}
                      >
                        {msg.text}

                        {/* Read Receipt / Time */}
                        <div className={`text-[9px] mt-1 font-medium flex items-center gap-1 justify-end opacity-70 ${msg.isMe ? 'text-indigo-100' : 'text-zinc-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {msg.isLiked && <Heart size={10} className="fill-pink-500 text-pink-500 ml-1" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-6 bg-[#020202] border-t border-white/5">

                {/* Replying Indicator */}
                {replyingTo && (
                  <div className="flex items-center justify-between bg-white/5 rounded-t-2xl px-4 py-2 border-b border-white/5 mb-[-1px] animate-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Reply size={14} className="scale-x-[-1]" />
                      <span>Replying to <span className="text-white font-bold">{replyingTo.isMe ? "Yourself" : activeUser?.username}</span></span>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                )}

                <div className={`flex items-center gap-3 relative z-10 ${replyingTo ? 'bg-[#121212] rounded-b-[28px] rounded-t-none' : ''}`}>

                  <button className="hidden md:flex w-10 h-10 rounded-full hover:bg-white/5 items-center justify-center text-zinc-400 hover:text-white transition-colors">
                    <Camera size={22} />
                  </button>

                  <div className="flex-1 bg-white/5 border border-white/5 rounded-full flex items-center focus-within:bg-white/10 focus-within:border-white/10 transition-all shadow-inner px-1">
                    <div className="pl-4 py-3 flex-1">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                        placeholder={replyingTo ? "Type your reply..." : "Message..."}
                        className="w-full bg-transparent border-none text-white placeholder-zinc-500 focus:outline-none text-[15px]"
                        autoFocus={!!replyingTo}
                      />
                    </div>

                    <div className="flex items-center pr-2 gap-1 text-zinc-500">
                      {!messageInput.trim() && <button className="p-2 hover:text-white transition-colors"><Smile size={20} /></button>}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!messageInput.trim()}
                    className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${messageInput.trim()
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.5)]'
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                      }`}
                  >
                    <Send size={20} className={messageInput.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} fill={messageInput.trim() ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            // Empty State (Desktop & Mobile Initial)
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
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
  )
}

function userStatusText(status: string | undefined): string {
  if (status === 'online') return 'Active now'
  return 'Active 1h ago'
}
