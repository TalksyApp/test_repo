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
    onReplyClick: (id: string, author: string) => void;
    activeReplyId?: string | null;
}

export default function CommentNode({ comment, depth = 0, currentUserId, onLike, onReplyClick, activeReplyId }: CommentNodeProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = activeReplyId === comment.id;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isLiked = comment.likes && comment.likes.includes(currentUserId);
    const likeCount = comment.likes ? comment.likes.length : 0;

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

    return (
        <div className={`relative flex flex-col ${depth > 0 ? 'mt-4' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>

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
                    {!isCollapsed && hasReplies && (
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
                        <span className={`font-bold text-[14px] hover:underline cursor-pointer transition-colors ${isActive ? 'text-indigo-400' : 'text-white'}`}>
                            {comment.author}
                        </span>
                        {comment.author === "Design_God" && (
                            <span className="bg-indigo-500/20 text-indigo-300 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                                OP
                            </span>
                        )}
                        <span className="text-zinc-500 text-xs">• {timeAgo(comment.timestamp)}</span>
                    </div>

                    {!isCollapsed ? (
                        <>
                            <div className="text-zinc-300 text-[15px] leading-relaxed break-words mb-2.5">
                                {comment.content}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 mb-2">
                                <button
                                    onClick={() => onLike && onLike(comment.id)}
                                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isLiked ? 'text-pink-500' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                                    {likeCount > 0 && likeCount}
                                </button>

                                <button
                                    onClick={() => onReplyClick(comment.id, comment.author)}
                                    className={`flex items-center gap-1.5 text-xs font-bold transition-all duration-300 ${isActive ? 'text-indigo-400' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    <MessageCircle size={14} fill={isActive ? "currentColor" : "none"} />
                                    {isActive ? 'Cancel' : 'Reply'}
                                </button>
                            </div>

                            {/* Nested Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-2">
                                    {comment.replies.map((reply, i) => (
                                        <CommentNode
                                            key={`${reply.id}-${i}`}
                                            comment={reply}
                                            depth={depth + 1}
                                            currentUserId={currentUserId}
                                            onLike={onLike}
                                            onReplyClick={onReplyClick}
                                            activeReplyId={activeReplyId}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-zinc-600 text-xs italic mb-2">Comment collapsed</div>
                    )}
                </div>
            </div>
        </div>
    );
}
