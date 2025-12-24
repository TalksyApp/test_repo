"use client"

import { useState, useEffect, useRef } from "react"
import { X, Search, Camera, Smile, Send, Trash2, ArrowLeft } from "lucide-react"
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
  const [activeChat, setActiveChat] = useState<string>("1")
  const [messageInput, setMessageInput] = useState("")
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

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }

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
    }

    setMessages([...messages, newMessage])
    setMessageInput("")
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center md:p-10">
      <div className="bg-[#050505] border border-[#1f1f1f] w-full max-w-6xl h-full md:h-[80vh] rounded-none md:rounded-[24px] flex overflow-hidden shadow-2xl">

        {/* Sidebar - User List (Hidden on mobile if chat is active, generic split view logic needed but for now assuming DM focus) 
            For this simplified prototype, I'll keep default listing but on mobile maybe hide it?
            Actually, user screenshot shows Single Chat View. 
            I'll make the Sidebar hidden on mobile.
        */}
        <div className="hidden md:flex w-1/3 border-r border-[#1f1f1f] flex-col bg-[#0a0a0a]">
          <div className="p-6">
            <h2 className="text-2xl font-black text-white mb-6">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-[#121212] border border-[#1f1f1f] rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#333]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setActiveChat(user.id)}
                className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${activeChat === user.id ? 'bg-[#1a1a1a]' : 'hover:bg-[#121212]'}`}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${activeChat === user.id ? 'bg-[#333]' : 'bg-[#1f1f1f]'}`}>
                    {user.avatar_initials}
                  </div>
                  {user.status === "online" && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-bold truncate ${activeChat === user.id ? 'text-white' : 'text-gray-300'}`}>{user.username}</h3>
                    <span className="text-xs text-gray-600">{user.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#050505] relative w-full">
          {/* Chat Header */}
          <div className="p-4 md:p-6 border-b border-[#1f1f1f] flex items-center justify-between pt-safe-top">
            <div className="flex items-center gap-3">
              {/* Back Button for Mobile */}
              <button onClick={onClose} className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white">
                <ArrowLeft size={24} />
              </button>

              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-purple-600`}>
                {activeUser?.avatar_initials}
              </div>
              <div>
                <h3 className="font-bold text-white">{activeUser?.username}</h3>
                <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  online
                </p>
              </div>
            </div>

            {/* Desktop Close Button */}
            <button
              onClick={onClose}
              className="hidden md:flex w-8 h-8 rounded-full bg-[#1f1f1f] items-center justify-center text-white hover:bg-[#333] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`group flex items-end gap-2 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                {/* Delete Button (Visible on Hover/Focus) */}
                {msg.isMe && (
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 p-1 hover:bg-white/5 rounded"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div
                  className={`max-w-[75%] px-5 py-3 rounded-2xl text-[15px] font-normal leading-relaxed shadow-sm
                    ${msg.isMe
                      ? 'bg-[#6366f1] text-white rounded-br-sm'
                      : 'bg-[#1a1a1a] text-zinc-100 rounded-bl-sm border border-white/5'
                    }`}
                >
                  {msg.text}
                  <div className={`text-[10px] mt-1 text-right opacity-60 ${msg.isMe ? 'text-indigo-200' : 'text-zinc-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 md:p-6 border-t border-[#1f1f1f] md:border-white/5 bg-[#050505] md:bg-transparent pb-[env(safe-area-inset-bottom)] bottom-0 sticky backdrop-blur-xl">
            <div className="flex items-center gap-2">

              {/* Desktop Camera */}
              <button className="hidden md:flex w-10 h-10 rounded-full hover:bg-white/5 items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <Camera size={20} />
              </button>

              <div className="flex-1 bg-[#121212] md:bg-white/5 border border-[#1f1f1f] md:border-white/5 rounded-[24px] flex items-center focus-within:border-[#333] md:focus-within:border-indigo-500/50 transition-colors shadow-lg px-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                  placeholder="Message..."
                  className="flex-1 bg-transparent border-none py-3.5 pl-3 text-white placeholder-gray-600 focus:outline-none"
                />

                {/* Desktop Smile */}
                {!messageInput.trim() && (
                  <div className="hidden md:flex pr-3 text-zinc-500 hover:text-white cursor-pointer transition-colors">
                    <Smile size={22} />
                  </div>
                )}
              </div>

              {/* Send Button (Always Visible Logic) */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!messageInput.trim()}
                className={`w-[45px] h-[45px] md:w-[50px] md:h-[50px] rounded-full flex items-center justify-center transition-all duration-300 shrink-0 border border-transparent bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] ${messageInput.trim()
                  ? 'opacity-100 hover:scale-110 active:scale-95 hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] cursor-pointer'
                  : 'opacity-50 grayscale scale-100 shadow-none cursor-not-allowed'
                  }`}
              >
                <Send size={20} className={messageInput.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
