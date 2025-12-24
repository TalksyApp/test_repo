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
    <div className={`flex w-full mb-3 px-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <div
          onClick={(e) => { e.stopPropagation(); onUserClick(post); }}
          className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0 mr-2 cursor-pointer self-end mb-1"
        >
          {post.userId ? post.userId[0].toUpperCase() : '?'}
        </div>
      )}

      <div className={`relative max-w-[75%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm break-words ${isMe
        ? 'bg-indigo-600 text-white rounded-br-sm'
        : 'bg-[#1f1f22] text-zinc-100 rounded-bl-sm border border-white/5'
        }`}>
        {!isMe && (
          <div className="text-[10px] font-bold text-indigo-400 mb-1 opacity-80">{post.userId}</div>
        )}

        {post.content}

        <div className={`text-[9px] mt-1 text-right font-medium tracking-wide opacity-60 ${isMe ? 'text-indigo-200' : 'text-zinc-500'}`}>
          {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
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

  const displayPosts = posts

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] md:relative md:inset-auto md:z-0 md:bg-transparent md:h-full flex flex-col animate-in fade-in slide-in-from-right-10 duration-300">

      {/* BACKGROUND PARTICLES (Subtle) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <LiveBackground />
      </div>

      {/* --- 1. HEADER (Whatsapp style) --- */}
      <div className="relative z-10 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 pt-safe-top pb-3 md:pt-4">
        <div className="px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-white">
              <ArrowLeft size={22} />
            </button>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {topic.name[0]}
            </div>

            <div>
              <div className="font-bold text-lg text-white leading-tight">#{topic.name}</div>
              <div className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Frequency Active
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-400">
            <button className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full hover:text-white transition-colors">
              <Users size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- 2. CHAT STREAM --- */}
      <div className="flex-1 overflow-y-auto w-full bg-transparent relative z-0 scrollbar-hide">
        <div className="min-h-full flex flex-col justify-end pb-24 pt-4">
          {displayPosts.length === 0 ? (
            <div className="text-center text-zinc-600 py-20 px-8">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                <Hash className="text-zinc-700" size={32} />
              </div>
              <p className="text-sm">This frequency is silent. Transmit the first signal.</p>
            </div>
          ) : (
            displayPosts.map((post) => (
              <ChatMessage key={post.id} post={post} onUserClick={() => { }} currentUser={currentUser} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* --- 3. INPUT AREA (Fixed Bottom) --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#050505] p-3 pb-[env(safe-area-inset-bottom)] z-50 border-t border-white/5 md:absolute md:bottom-0 md:bg-transparent md:border-none md:pb-6">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          {/* Plus Icon (Optional, keeping it clean as requested) */}
          {/* <button className="p-3 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-full mb-0.5">
             <PlusCircle size={24} />
           </button> */}

          <div className="flex-1 bg-[#1a1a1a] rounded-[24px] flex items-center border border-white/5 focus-within:border-white/20 transition-colors min-h-[50px]">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message..."
              className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-[16px] px-5 py-3.5 max-h-32"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300 shrink-0 border border-transparent bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] ${inputValue.trim()
              ? 'opacity-100 hover:scale-110 active:scale-95 hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] cursor-pointer'
              : 'opacity-50 grayscale scale-100 shadow-none cursor-not-allowed'
              }`}
          >
            <Send
              size={22}
              className={`transition-all duration-300 ${inputValue.trim() ? "translate-x-0.5 -translate-y-0.5 scale-110" : ""}`}
              fill="currentColor"
            />
          </button>
        </div>
      </div>

    </div>
  );
}


