"use client"

import React, { useState } from 'react';
import { MoreHorizontal, Heart, MessageCircle, Send, User } from 'lucide-react';

export interface Comment {
    id: string;
    userId: string;
    author: string;
    handle: string;
    avatar: string;
    content: string;
    timestamp: number;
    likes: string[]; // IDs of users who liked
    replies?: Comment[];
}

interface CommentNodeProps {
    comment: Comment;
    depth?: number;
    currentUserId: string;
    onLike?: (id: string) => void;
    onReply?: (parentId: string, content: string) => void;
}

export default function CommentNode({ comment, depth = 0, currentUserId, onLike, onReply }: CommentNodeProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");

    const hasReplies = comment.replies && comment.replies.length > 0;
    const isLiked = comment.likes && comment.likes.includes(currentUserId);
    const likeCount = comment.likes ? comment.likes.length : 0;
    const isTopLevel = depth === 0;

    // Time formatting
    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        return Math.floor(hours / 24) + 'd';
    };

    const handleReplySubmit = () => {
        if (!replyText.trim() || !onReply) return;
        onReply(comment.id, replyText);
        setReplyText("");
        setIsReplying(false);
        setIsCollapsed(false); // Ensure we see the reply
    };

    return (
        <div className={`relative flex flex-col ${depth > 0 ? 'mt-4' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>

            {/* Thread Line (Left side) - Only for nested items or if it has children? 
                Actually, standard Reddit style:
                The line belongs to the PARENT's container, but here we are recursive.
                So we draw a line on the LEFT of the children container.
            */}

            <div className="flex gap-3">
                {/* Avatar / Collapse Column */}
                <div className="flex flex-col items-center shrink-0">
                    {!isCollapsed ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-sm cursor-pointer hover:border-white/20 transition-colors"
                            onClick={() => setIsCollapsed(true)}>
                            {comment.avatar || <User size={14} />}
                        </div>
                    ) : (
                        <div className="w-8 h-8 flex items-center justify-center cursor-pointer text-zinc-500 hover:text-indigo-400 transition-colors"
                            onClick={() => setIsCollapsed(false)}>
                            <MoreHorizontal size={18} />
                        </div>
                    )}

                    {/* Interactive Thread Line */}
                    {!isCollapsed && (hasReplies || isReplying) && (
                        <div
                            className="w-0.5 grow bg-zinc-800/50 hover:bg-indigo-500 cursor-pointer transition-colors mt-2 rounded-full min-h-[20px]"
                            onClick={() => setIsCollapsed(true)}
                        />
                    )}
                </div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-[14px] hover:underline cursor-pointer">
                            {comment.author}
                        </span>
                        {comment.author === "Design_God" && (
                            <span className="bg-indigo-500/20 text-indigo-300 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                                OP
                            </span>
                        )}
                        <span className="text-zinc-500 text-xs">• {timeAgo(comment.timestamp)}</span>
                    </div>

                    {!isCollapsed && (
                        <>
                            {/* Text */}
                            <div className="text-zinc-300 text-[15px] leading-relaxed font-light break-words">
                                {comment.content}
                            </div>

                            {/* Actions Bar */}
                            <div className="flex items-center gap-4 mt-2">
                                {/* Like */}
                                <button
                                    onClick={() => onLike && onLike(comment.id)}
                                    className="flex items-center gap-1.5 text-zinc-500 hover:text-pink-500 transition-colors group"
                                >
                                    <Heart size={16} className={`transition-transform duration-200 ${isLiked ? 'fill-pink-500 text-pink-500' : 'group-hover:scale-110'}`} />
                                    <span className={`text-xs font-medium ${isLiked ? 'text-pink-500' : ''}`}>{likeCount || "Vote"}</span>
                                </button>

                                {/* Reply Toggle */}
                                <button
                                    onClick={() => setIsReplying(!isReplying)}
                                    className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                                >
                                    <MessageCircle size={16} />
                                    Reply
                                </button>

                                <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>

                            {/* Inline Reply Input */}
                            {isReplying && (
                                <div className="mt-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {/* Line connecting to input */}
                                    <div className="w-[2px] h-full absolute -left-[19px] top-8 bg-zinc-800" />

                                    <div className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl p-1 flex items-center shadow-lg focus-within:border-indigo-500/50 transition-colors">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
                                            placeholder={`Reply to ${comment.author}...`}
                                            className="flex-1 bg-transparent border-none outline-none text-white text-sm px-3 py-2 min-w-0 placeholder-zinc-600"
                                        />
                                        <button
                                            onClick={handleReplySubmit}
                                            disabled={!replyText.trim()}
                                            className={`p-2 rounded-lg font-bold transition-all ${replyText.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'text-zinc-600 cursor-not-allowed'}`}
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Nested Replies Container */}
                            {hasReplies && (
                                <div className="mt-2">
                                    {comment.replies!.map(reply => (
                                        <CommentNode
                                            key={reply.id}
                                            comment={reply}
                                            depth={depth + 1}
                                            currentUserId={currentUserId}
                                            onLike={onLike}
                                            onReply={onReply}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
