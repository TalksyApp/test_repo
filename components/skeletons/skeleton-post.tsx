"use client"

import React from 'react';

export default function SkeletonPost() {
    return (
        <div className="bg-[#0a0a0a]/40 backdrop-blur-sm border border-white/5 rounded-3xl p-5 relative overflow-hidden w-full max-w-[1200px] mb-4">

            {/* HEADER SECTION */}
            <div className="flex items-center gap-3 mb-4">
                {/* Avatar Skeleton */}
                <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse shrink-0" />

                <div className="flex flex-col gap-2 w-full">
                    {/* Name & Badge Skeleton */}
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-32 bg-white/5 rounded-md animate-pulse" />
                        <div className="w-3 h-3 rounded-full bg-white/5 animate-pulse" />
                    </div>
                    {/* Handle & Time Skeleton */}
                    <div className="h-3 w-24 bg-white/5 rounded-md animate-pulse" />
                </div>
            </div>

            {/* CONTENT BODY */}
            <div className="pl-[52px] space-y-2 mb-6">
                <div className="h-4 w-3/4 bg-white/5 rounded-md animate-pulse" />
                <div className="h-4 w-full bg-white/5 rounded-md animate-pulse" />
                <div className="h-4 w-5/6 bg-white/5 rounded-md animate-pulse" />
            </div>

            {/* TAGS */}
            <div className="pl-[52px] flex gap-2 mb-4">
                <div className="h-6 w-16 bg-white/5 rounded-md animate-pulse" />
                <div className="h-6 w-20 bg-white/5 rounded-md animate-pulse" />
            </div>

            {/* ACTION BUTTONS */}
            <div className="pl-[52px] flex gap-6 pt-3 border-t border-white/5">
                <div className="w-6 h-6 rounded-full bg-white/5 animate-pulse" />
                <div className="w-6 h-6 rounded-full bg-white/5 animate-pulse" />
                <div className="w-6 h-6 rounded-full bg-white/5 animate-pulse" />
            </div>

        </div>
    );
}
