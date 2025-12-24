"use client"

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Hash, Bell, Search,
  Smile, Send, Users, Gift, Sticker, PlusCircle
} from 'lucide-react';
import { type User, type Post } from "@/lib/storage"
import LiveBackground from "@/components/live-background";

/* --- CUSTOM COMPONENT: COMPACT CHAT MESSAGE --- */
interface ChatMessageProps {
  post: Post;
  onUserClick: (user: any) => void;
  currentUser: User;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ post, onUserClick, currentUser }) => {
  const isMe = post.userId === currentUser.id;

  return (
    // rounded-[32px] for extra curvy look
    <div className={`group flex items-start gap-4 px-6 py-4 hover:bg-white/5 rounded-[32px] transition-all duration-200 border border-transparent hover:border-white/5 bg-black/40 backdrop-blur-md mb-3 mx-2 shadow-sm ${isMe ? 'border-l-4 border-l-indigo-500' : ''}`}>
      {/* Avatar */}
      <div
        onClick={(e) => { e.stopPropagation(); onUserClick(post); }}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20 shrink-0 border-2 border-black"
      >
        {post.userId.charAt(0).toUpperCase()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span
            onClick={(e) => { e.stopPropagation(); onUserClick(post); }}
            className="font-bold text-white hover:underline cursor-pointer text-[15px]"
          >
            {post.userId}
          </span>
          {/* Verified Badge (Simulated) */}
          {post.userId === "user_design_god" && <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-black font-black">✓</div>}

          <span className="text-xs text-zinc-500 font-medium">{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <p className="text-zinc-200 text-[15px] leading-relaxed break-words font-light">
          {post.content}
        </p>
      </div>
    </div>
  );
};

interface TopicDetailProps {
  topic: { name: string } | any;
  onBack: () => void;
  currentUser: User;
}

export default function TopicDetail({ topic, currentUser, onBack }: TopicDetailProps) {
  const [inputValue, setInputValue] = useState("");
  const [posts, setPosts] = useState<Post[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Logic
  useEffect(() => {
    const fetchTopicPosts = async () => {
      try {
        const response = await fetch(`/api/posts?userId=${currentUser.id}`)
        if (response.ok) {
          const allPosts = await response.json()
          const topicPosts = allPosts.filter((post: any) =>
            post.tags && post.tags.includes(topic.name)
          )

          const transformedPosts = topicPosts.map((post: any) => ({
            id: post.id,
            userId: post.user_id || '',
            content: post.content,
            timestamp: new Date(post.created_at).getTime(),
            likes: post.likes_count || 0,
            replies: [],
            comments: post.comments_count || 0,
            author: post.username,
            handle: `@${post.username}`,
            avatar: post.avatar_initials || post.username[0],
            tags: post.tags || [],
            isBoosted: post.is_boosted || false,
            isLikedByUser: post.is_liked_by_user || false
          }))

          setPosts(transformedPosts)
        }
      } catch (error) {
        console.error('Error fetching topic posts:', error)
      }
    }
    fetchTopicPosts()
  }, [topic, currentUser.id])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  const handleSend = async () => {
    if (inputValue.trim()) {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: inputValue.trim(),
            userId: currentUser.id,
            tags: [topic.name],
            isBoosted: false
          })
        })

        if (response.ok) {
          const { id } = await response.json()
          const newPost: Post = {
            id,
            userId: currentUser.id,
            content: inputValue.trim(),
            timestamp: Date.now(),
            likes: [],
            replies: [],
            // @ts-ignore
            author: currentUser.username,
            handle: `@${currentUser.username}`,
            avatar: currentUser.avatar_initials || currentUser.username[0],
            tags: [topic.name],
            isBoosted: false,
            isLikedByUser: false
          }

          setPosts([...posts, newPost]) // Append to end for chat stream
          setInputValue("")
        }
      } catch (error) {
        console.error('Error creating post:', error)
      }
    }
  };

  const displayPosts = posts;

  return (
    <div className="fixed inset-0 z-[60] md:relative md:inset-auto md:z-auto flex flex-col h-full w-full bg-black overflow-hidden">

      {/* --- LIVE BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-purple-900/20"></div>
        <LiveBackground />
      </div>

      {/* --- VOID WATERMARK (Fixed Background) --- */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 opacity-10 select-none">
        <div className="relative">
          <Hash size={300} className="text-indigo-500 animate-pulse" />
          <div className="absolute inset-0 bg-indigo-500/20 blur-[100px]"></div>
        </div>
        <h1 className="text-6xl font-black text-white tracking-tighter mt-8">#{topic.name}</h1>
        <p className="text-xl text-zinc-400 mt-4 font-light tracking-widest uppercase">Frequency Active</p>
      </div>

      {/* --- 1. HEADER (Glassmorphism) --- */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="hover:bg-white/10 p-2 rounded-full text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-zinc-900/50 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
              <Hash size={24} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-display tracking-tight leading-none">{topic.name}</h1>
              <p className="text-xs text-zinc-500 font-medium mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                Live Channel
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-zinc-400">
          <div className="hidden sm:flex items-center -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-9 h-9 rounded-full bg-zinc-800 border-[3px] border-black flex items-center justify-center text-xs font-bold text-zinc-500">
                U{i}
              </div>
            ))}
            <div className="w-9 h-9 rounded-full bg-zinc-800 border-[3px] border-black flex items-center justify-center text-xs font-bold text-white">
              +42
            </div>
          </div>
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <Bell size={20} className="hover:text-white cursor-pointer transition-colors" />
          <Search size={20} className="hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>

      {/* --- 2. CHAT STREAM --- */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent z-10 relative">
        <div className="space-y-1 pb-32 pt-24">
          {displayPosts.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <p>Welcome to #{topic.name}. Be the first to transmit.</p>
            </div>
          ) : (
            displayPosts.map((post) => (
              <ChatMessage key={post.id} post={post} onUserClick={() => { }} currentUser={currentUser} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* --- 3. INPUT AREA (Floating Command Bar) --- */}
      <div className="absolute bottom-6 left-0 right-0 px-6 z-50">
        <div className="max-w-4xl mx-auto relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-md group-focus-within:opacity-50 transition duration-500"></div>

          {/* CAPSULE INPUT CONTAINER */}
          <div className="relative bg-[#0c0c0e]/90 backdrop-blur-xl rounded-full flex items-center p-2 border border-white/10 shadow-2xl">

            <button className="p-3 hover:bg-white/10 rounded-full text-zinc-400 hover:text-yellow-400 transition-colors">
              <Smile size={24} />
            </button>

            <div className="h-6 w-px bg-white/10 mx-2"></div>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message #${topic.name}...`}
              className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-lg font-medium px-2"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              autoFocus
            />

            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`p-3.5 rounded-full transition-all duration-300 ${inputValue.trim()
                ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
            >
              <Send size={20} fill={inputValue.trim() ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
