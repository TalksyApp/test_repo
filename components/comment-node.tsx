"use client"

import React, { useState } from 'react';
import { MoreHorizontal, Heart, MessageCircle, CornerDownRight } from 'lucide-react';

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
    onReply?: (author: string) => void;
}

export default function CommentNode({ comment, depth = 0, currentUserId, onLike, onReply }: CommentNodeProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const hasReplies = comment.replies && comment.replies.length > 0;

    // Check if current user liked this comment
    const isLiked = comment.likes && comment.likes.includes(currentUserId);
    const likeCount = comment.likes ? comment.likes.length : 0;

    // Format relative time (basic implementation)
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
        <div className={`relative ${depth > 0 ? 'ml-8 sm:ml-12' : ''} animate-in fade-in slide-in-from-bottom-2 duration-500`}>

            {/* CONNECTION LINES (Aesthetic Tree) */}
            {depth > 0 && (
                <>
                    {/* Vertical Line from Parent */}
                    <div className="absolute -left-8 sm:-left-12 top-0 w-px h-full bg-gradient-to-b from-white/10 to-transparent group-hover:from-indigo-500/30 transition-colors duration-500"></div>
                    {/* Curved Connector */}
                    <div className="absolute -left-8 sm:-left-12 top-8 w-8 sm:w-12 h-6 border-b border-l border-white/10 rounded-bl-3xl group-hover:border-indigo-500/30 transition-colors duration-500"></div>
                </>
            )}

            <div className="group relative">
                {/* Comment Card */}
                <div className={`
                    relative overflow-hidden rounded-[24px] p-5 transition-all duration-300
                    border border-white/5 bg-[#0c0c0e]/80 backdrop-blur-md
                    hover:border-white/10 hover:bg-[#121214] hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]
                    ${isCollapsed ? 'opacity-60' : ''}
                `}>

                    {/* Glow Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center text-sm font-bold text-white shadow-inner shrink-0">
                                {comment.avatar}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-white text-[15px] tracking-wide hover:text-indigo-400 cursor-pointer transition-colors">
                                        {comment.author}
                                    </span>
                                    {comment.author === "Design_God" && ( // Example of a badge logic
                                        <div className="bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-[9px] font-bold text-indigo-400 uppercase tracking-wider">
                                            Author
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs text-zinc-500 font-medium">{timeAgo(comment.timestamp)}</span>
                            </div>
                        </div>

                        {/* Collapse Toggle */}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-zinc-600 hover:text-white transition-colors"
                        >
                            {isCollapsed ? <MoreHorizontal size={16} /> : <div className="w-1 h-1 rounded-full bg-zinc-600 group-hover:bg-zinc-400 transition-colors"></div>}
                        </button>
                    </div>

                    {/* Content */}
                    {!isCollapsed && (
                        <div className="relative z-10">
                            <p className="text-zinc-300 text-[15px] leading-relaxed pl-[52px] font-light">
                                {comment.content}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-6 mt-4 pl-[52px]">
                                <button
                                    onClick={() => onLike && onLike(comment.id)}
                                    className={`flex items-center gap-2 transition-all duration-300 text-xs font-semibold group/btn 
                                        ${isLiked
                                            ? 'text-pink-500'
                                            : 'text-zinc-500 hover:text-pink-400'
                                        }`}
                                >
                                    <div className={`p-1.5 rounded-full transition-colors ${isLiked ? 'bg-pink-500/10' : 'group-hover/btn:bg-pink-500/10'}`}>
                                        <Heart size={16} className={`transition-transform duration-300 ${isLiked ? 'fill-current scale-110' : 'group-hover/btn:scale-110'}`} />
                                    </div>
                                    <span>{likeCount || "Like"}</span>
                                </button>

                                <button
                                    onClick={() => onReply && onReply(comment.author)}
                                    className="flex items-center gap-2 text-zinc-500 hover:text-indigo-400 transition-all duration-300 text-xs font-semibold group/reply"
                                >
                                    <div className="p-1.5 rounded-full group-hover/reply:bg-indigo-500/10 transition-colors">
                                        <MessageCircle size={16} />
                                    </div>
                                    Reply
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Nested Replies */}
            {!isCollapsed && hasReplies && (
                <div className="mt-4 relative">
                    {/* Vertical Thread Line for Children */}
                    <div className="absolute -left-8 sm:-left-12 top-0 bottom-6 w-px bg-gradient-to-b from-white/10 to-transparent"></div>

                    <div className="flex flex-col gap-4">
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
                </div>
            )}
        </div>
    );
};
