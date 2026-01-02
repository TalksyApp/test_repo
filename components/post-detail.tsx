"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, ArrowLeft, Send, CheckCircle2, Zap } from 'lucide-react';
import type { User } from "@/lib/storage"
import CommentNode from './comment-node';
import type { Comment } from './comment-node';

interface PostDetailProps {
  post: any;
  currentUser: User;
  onBack: () => void;
  onLike?: (id: string) => void;
}

const Avatar = ({ char, isBoosted }: { char: string, isBoosted: boolean }) => (
  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-white font-bold shadow-lg shrink-0 transition-all duration-300
    ${isBoosted
      ? 'bg-yellow-500 text-black border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
      : 'bg-gradient-to-br from-[#222] to-[#111] border-white/10'}`
  }>
    {char}
  </div>
);

export default function PostDetail({ post, currentUser, onBack, onLike }: PostDetailProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string, author: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const isBoosted = post.isPromoted || post.isBoosted;
  const authorName = post.author || "User";
  const handle = post.handle || `@${authorName.toLowerCase()}`;
  const avatarChar = post.avatar || authorName[0] || "?";
  const time = post.time || (post.timestamp ? new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Now");
  const likesCount = post.likes ? (Array.isArray(post.likes) ? post.likes.length : post.likes) : 0;
  const isLiked = post.isLikedByUser || false;

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`);
      if (response.ok) {
        const data = await response.json();

        // Build Tree Structure from Flat List
        const commentMap = new Map<string, Comment>();
        const roots: Comment[] = [];

        // 1. Create nodes
        data.forEach((c: any) => {
          commentMap.set(c.id, { ...c, replies: [] });
        });

        // 2. Link parents
        data.forEach((c: any) => {
          const node = commentMap.get(c.id);
          if (node) {
            if (c.parentId && commentMap.has(c.parentId)) {
              commentMap.get(c.parentId)!.replies!.push(node);
            } else {
              roots.push(node);
            }
          }
        });

        setComments(roots);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const handleSubmit = async () => {
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Determine if Top Level or Reply
      const payload: any = {
        content: commentText,
        userId: currentUser.id
      };

      if (replyingTo) {
        payload.parentId = replyingTo.id;
      }

      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setCommentText('');
        setReplyingTo(null); // Reset reply state
        await fetchComments();

        // Scroll logic: If top level, scroll to bottom. If reply, maybe stay put?
        // For now, keep simple.
        if (!replyingTo) {
          setTimeout(() => {
            commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler passed to CommentNode
  const handleReplyClick = (id: string, author: string) => {
    if (replyingTo?.id === id) {
      setReplyingTo(null); // Toggle off if clicking active
    } else {
      setReplyingTo({ id, author });
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }

  const handleCommentLike = (commentId: string) => {
    // Current implementation only updates local state visually
    setComments(comments.map(comment => {
      // Helper to update deeply nested comments
      const updateNested = (c: Comment): Comment => {
        if (c.id === commentId) {
          const isLiked = c.likes && c.likes.includes(currentUser.id);
          const newLikes = isLiked
            ? (c.likes || []).filter(id => id !== currentUser.id)
            : [...(c.likes || []), currentUser.id];
          return { ...c, likes: newLikes };
        }
        if (c.replies) {
          return { ...c, replies: c.replies.map(updateNested) };
        }
        return c;
      };
      return updateNested(comment);
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] w-full h-full bg-black md:bg-transparent md:relative md:inset-auto md:z-0 font-sans">
      <div className="w-full h-full overflow-y-auto pt-10 pb-32 px-4 sm:px-8 animate-in fade-in slide-in-from-right-8 duration-500 scrollbar-hide">

        {/* HEADER */}
        <div className="max-w-[800px] mx-auto">
          {/* Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-white">Thread</h1>
          </div>

          {/* MAIN POST CARD */}
          <div className={`bg-[#0a0a0a]/80 backdrop-blur-sm border rounded-[24px] p-6 sm:p-8 mb-8 transition-all duration-300 relative overflow-hidden group
                ${isBoosted
              ? 'border-yellow-500/40 shadow-[0_0_40px_rgba(234,179,8,0.05)]'
              : 'border-white/10'}`
          }>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 items-center">
                <Avatar char={avatarChar} isBoosted={isBoosted} />
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`font-bold text-xl transition-colors ${isBoosted ? 'text-yellow-100' : 'text-white'}`}>{authorName}</div>
                    <CheckCircle2 size={14} className="text-blue-500" fill="black" />
                  </div>
                  <div className="text-sm text-gray-500">{handle} • {time}</div>
                </div>
              </div>

              {isBoosted && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold text-yellow-400 flex items-center gap-1">
                  <Zap size={12} fill="currentColor" /> PROMOTED
                </div>
              )}
            </div>

            {/* Content */}
            <p className="text-xl text-gray-100 font-light leading-relaxed mb-6 pl-[64px]">
              {post.content}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="pl-[64px] mb-6 flex gap-2 flex-wrap">
                {post.tags.map((tag: string, i: number) => (
                  <span key={i} className="text-xs font-bold text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-6 pl-[64px] pt-6 border-t border-white/5">
              <button
                onClick={() => onLike && onLike(post.id)}
                className={`flex items-center gap-2 transition-all ${isLiked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'}`}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                <span className="text-sm font-medium">{likesCount}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-500">
                <MessageCircle size={20} />
                <span className="text-sm font-medium">{comments.length}</span>
              </div>
              <button className="flex items-center gap-2 text-gray-500 hover:text-green-400 transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* COMMENTS SECTION */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-6 text-zinc-500 text-xs font-bold uppercase tracking-wider ml-4">
              All Comments ({comments.length})
            </div>

            {/* Thread Container */}
            <div className="flex flex-col gap-8 relative">
              {comments.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No comments yet. Start the conversation!
                </div>
              ) : (
                comments.map((comment, index) => (
                  <CommentNode
                    key={`${comment.id}-${index}`}
                    comment={comment}
                    currentUserId={currentUser.id}
                    onLike={handleCommentLike}
                    onReplyClick={handleReplyClick}
                    activeReplyId={replyingTo?.id}
                  />
                ))
              )}
              <div ref={commentsEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* UNIFIED BOTTOM INPUT BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent z-40 transition-all duration-300">

        {/* Reply Context Banner */}
        {replyingTo && (
          <div className="max-w-[800px] mx-auto mb-2 flex items-center justify-between px-4 py-2 bg-[#18181b] border border-white/10 rounded-t-2xl rounded-b-lg border-b-0 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
              Replying to <span className="text-white font-bold">@{replyingTo.author}</span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <div className="text-xs font-bold">CANCEL</div>
            </button>
          </div>
        )}

        <div className={`max-w-[800px] mx-auto bg-[#18181b] border border-white/10 rounded-3xl p-2 flex items-center shadow-2xl group focus-within:border-indigo-500/50 transition-colors ${replyingTo ? 'rounded-t-sm' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white ml-1 shrink-0">
            {currentUser.avatar_initials || currentUser.username[0]}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={replyingTo ? `Reply to ${replyingTo.author}...` : "Add a top-level comment..."}
            className="flex-1 bg-transparent border-none outline-none text-white px-4 text-sm placeholder-zinc-500"
          />
          <button
            onClick={handleSubmit}
            disabled={!commentText.trim() || isSubmitting}
            className={`p-2 rounded-full font-bold text-xs transition-all duration-300 ${commentText.trim() ? 'bg-white text-black hover:scale-105' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

