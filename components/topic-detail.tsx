"use client"

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Hash, Bell, Search,
  Smile, Send, Users, Gift, Sticker, PlusCircle, Heart
} from 'lucide-react';
import { type User, type Post, storage } from "@/lib/storage"
import LiveBackground from "@/components/live-background";
import { getThemeForTopic, TopicTheme } from "@/lib/topic-themes";

/* --- CUSTOM COMPONENT: COMPACT CHAT MESSAGE --- */
interface ChatMessageProps {
  post: Post;
  onUserClick: (user: any) => void;
  currentUser: User;
  theme: TopicTheme;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ post, onUserClick, currentUser, theme }) => {
  const isMe = post.userId === currentUser.id;

  return (
    <div className={`flex w-full mb-3 px-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <div
          onClick={(e) => { e.stopPropagation(); onUserClick(post); }}
          className={`w-8 h-8 rounded-full bg-opacity-20 border border-opacity-30 flex items-center justify-center text-xs font-bold shrink-0 mr-2 cursor-pointer self-end mb-1 ${theme.primary.replace('text-', 'bg-').replace('400', '500') + '/20'} ${theme.primary.replace('text-', 'border-').replace('400', '500') + '/30'} ${theme.primary}`}
        >
          {post.userId ? post.userId[0].toUpperCase() : '?'}
        </div>
      )}

      <div className={`relative max-w-[75%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm break-words ${isMe
        ? `${theme.bubbleSelf} rounded-br-sm`
        : 'bg-[#1f1f22] text-zinc-100 rounded-bl-sm border border-white/5'
        }`}>
        {!isMe && (
          <div className={`text-[10px] font-bold mb-1 opacity-80 ${theme.primary}`}>{post.userId}</div>
        )}

        {post.content}

        <div className={`text-[9px] mt-1 text-right font-medium tracking-wide opacity-60 ${isMe ? 'text-white/70' : 'text-zinc-500'}`}>
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
  const [isFollowed, setIsFollowed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get Dynamic Theme
  const theme = getThemeForTopic(topic.name);

  // Initialize Follow State
  useEffect(() => {
    if (currentUser?.followedTopics?.includes(topic.name)) {
      setIsFollowed(true)
    }
  }, [currentUser, topic.name])

  // Toggle Follow Logic
  const toggleFollow = () => {
    const newStatus = !isFollowed
    setIsFollowed(newStatus)

    // Update Local Storage
    const updatedUser = { ...currentUser }
    if (!updatedUser.followedTopics) updatedUser.followedTopics = []

    if (newStatus) {
      if (!updatedUser.followedTopics.includes(topic.name)) {
        updatedUser.followedTopics.push(topic.name)
      }
    } else {
      updatedUser.followedTopics = updatedUser.followedTopics.filter(t => t !== topic.name)
    }

    storage.setCurrentUser(updatedUser)
  }

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
            // @ts-ignore
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

            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg bg-gradient-to-br ${theme.gradient}`}>
              {topic.name[0]}
            </div>

            <div>
              <div className="font-bold text-lg text-white leading-tight">#{topic.name}</div>
              <div className={`text-xs font-medium flex items-center gap-1 ${theme.primary}`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${theme.primaryBg.replace('bg-', 'bg-')}`}></span>
                Frequency Active
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-400">
            {/* FOLLOW BUTTON */}
            <button
              onClick={toggleFollow}
              className={`p-2 rounded-full transition-all duration-300 ${isFollowed ? `bg-white/5 ${theme.heartColor}` : 'hover:bg-white/10 hover:text-white'}`}
              title={isFollowed ? "Remove from Orbit" : "Add to Orbit"}
            >
              <Heart size={20} fill={isFollowed ? "currentColor" : "none"} className={isFollowed ? "animate-pulse" : ""} />
            </button>

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
              <ChatMessage key={post.id} post={post} onUserClick={() => { }} currentUser={currentUser} theme={theme} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* --- 3. INPUT AREA --- */}
      <div className="p-3 md:p-4 bg-[#050505] border-t border-white/5 relative z-10 pb-safe-bottom">
        <div className="bg-[#1a1a1c] border border-white/5 rounded-3xl flex items-center px-2 py-2 shadow-lg w-full max-w-3xl mx-auto">
          <button className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
            <PlusCircle size={22} />
          </button>

          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Transmit signal..."
            className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none px-3 font-medium text-[15px]"
          />

          <button className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
            <Sticker size={20} />
          </button>

          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`p-2.5 rounded-full ml-1 transition-all ${inputValue.trim()
              ? `${theme.primaryBg} text-white hover:brightness-110 shadow-lg scale-100`
              : 'bg-white/5 text-zinc-600 scale-95'
              }`}
          >
            <Send size={18} fill="currentColor" />
          </button>
        </div>
      </div>

    </div>
  );
}
