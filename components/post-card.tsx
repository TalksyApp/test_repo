"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, CheckCircle2, Zap, LucideIcon, Trash2, Flag } from 'lucide-react';

interface PostCardProps {
  post: any; // Using any for compatibility with existing data structure
  onUserClick?: (post: any) => void;
  currentUser?: any;
  onLike?: (id: string) => void;
  onClick?: () => void;
  onDelete?: (id: string) => void;
  onReport?: (id: string) => void;
}

const Avatar = ({ char, isBoosted }: { char: string, isBoosted: boolean }) => (
  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-white text-sm font-bold shadow-lg shrink-0 transition-all duration-300
    ${isBoosted
      ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
      : 'bg-gradient-to-br from-[#222] to-[#111] border-white/10'}`
  }>
    {char}
  </div>
);

interface BtnProps {
  icon: LucideIcon;
  count?: number;
  color: string;
  onClick?: () => void;
  isActive?: boolean;
}

const Btn: React.FC<BtnProps> = ({ icon: Icon, count, color, onClick, isActive }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    className={`flex items-center gap-1.5 transition-all group/btn ${isActive ? 'text-pink-500' : `text-gray-500 ${color}`}`}
  >
    <Icon size={18} className="group-hover/btn:scale-110 transition-transform" fill={isActive ? 'currentColor' : 'none'} />
    {count !== undefined && <span className="text-xs font-medium">{count}</span>}
  </button>
);

export default function PostCard({ post, onUserClick, currentUser, onLike, onClick, onDelete, onReport }: PostCardProps) {
  // Dynamic Styles based on "Boost"
  const isBoosted = post.isPromoted || post.isBoosted; // Handle both naming conventions

  // Adapt post data if it comes from storage (different field names)
  const authorName = post.author || "User";
  const handle = post.handle || `@${authorName.toLowerCase()}`;
  const avatarChar = post.avatar || authorName[0] || "?";
  const time = post.time || (post.timestamp ? new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Now");
  const likesCount = post.likes ? (Array.isArray(post.likes) ? post.likes.length : post.likes) : 0;
  const commentsCount = post.comments || (post.replies ? post.replies.length : 0);
  const isLiked = post.isLikedByUser || false;

  // --- MENU STATE ---
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- PERMISSIONS ---
  // Simple check: Author or Admin
  const isAuthor = currentUser?.id === post.authorId;
  const isAdmin = currentUser?.email === 'admin@talksy.app'; // Hardcoded admin check as requested
  const canDelete = isAuthor || isAdmin;

  return (
    <div
      onClick={onClick}
      className={`bg-[#0a0a0a]/80 backdrop-blur-sm border rounded-3xl p-5 relative overflow-visible transition-all duration-300 group cursor-pointer
      ${isBoosted
          ? 'border-yellow-500/40 shadow-[0_0_40px_rgba(234,179,8,0.05)] hover:border-yellow-500/60'
          : 'border-white/10 hover:border-white/20 hover:bg-[#111] shadow-[0_0_30px_rgba(255,255,255,0.02)] hover:shadow-[0_0_50px_rgba(255,255,255,0.05)]'}`
      }>

      {/* --- SIDE GLOW ACCENT --- */}
      {!isBoosted && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(99,102,241,0.6)] opacity-80 group-hover:opacity-100 group-hover:w-1.5 transition-all duration-300 rounded-l-3xl"></div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div
          className="flex gap-3 items-center cursor-pointer"
          onClick={(e) => { e.stopPropagation(); if (onUserClick) onUserClick({ ...post, author: authorName, handle, avatar: avatarChar }); }}
        >
          <Avatar char={avatarChar} isBoosted={isBoosted} />
          <div>
            <div className="flex items-center gap-1.5">
              <div className={`font-bold text-base transition-colors ${isBoosted ? 'text-yellow-100' : 'text-white group-hover:text-indigo-400'}`}>{authorName}</div>
              {/* Verified Badge */}
              <CheckCircle2 size={12} className="text-blue-500" fill="black" />
            </div>
            <div className="text-xs text-gray-500">{handle} • {time}</div>
          </div>
        </div>

        {/* Top Right Icon (Menu or Boost Badge) */}
        {isBoosted ? (
          <div className="bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-yellow-400 flex items-center gap-1">
            <Zap size={10} fill="currentColor" /> PROMOTED
          </div>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="text-gray-600 hover:text-white transition-colors p-1"
            >
              <MoreHorizontal size={18} />
            </button>

            {/* --- DROPDOWN MENU --- */}
            {showMenu && (
              <div className="absolute right-0 top-6 w-32 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-[50] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col py-1">
                  {canDelete ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete && onDelete(post.id); }}
                      className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-white/5 text-xs font-bold transition-colors text-left"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowMenu(false); onReport && onReport(post.id); }}
                      className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 text-xs font-bold transition-colors text-left"
                    >
                      <Flag size={14} /> Report
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-[15px] text-gray-200 font-normal leading-relaxed mb-3 pl-[52px]">
        {post.content}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="pl-[52px] mb-3 flex gap-2 flex-wrap">
          {post.tags.map((tag: string, i: number) => (
            <span key={i} className="text-[11px] font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/5 hover:text-indigo-400 transition-colors cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center justify-between pl-[52px] pt-3 border-t border-white/5">
        <div className="flex gap-6">
          <Btn icon={Heart} count={likesCount} color="hover:text-pink-500" isActive={isLiked} onClick={() => onLike && onLike(post.id)} />
          <Btn icon={MessageCircle} count={commentsCount} color="hover:text-blue-400" />
          <Btn icon={Share2} color="hover:text-green-400" />
        </div>
      </div>
    </div>
  );
}
