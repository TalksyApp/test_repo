"use client"

import React from 'react';
import { ExternalLink, Zap } from 'lucide-react';

export default function AdCard() {
    return (
        <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-white/5 rounded-3xl p-0 relative overflow-hidden group cursor-pointer mb-4 hover:border-white/10 transition-all duration-300">

            {/* "Sponsored" Label */}
            <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                SPONSORED
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col md:flex-row">

                {/* Visual / Banner Side */}
                <div className="w-full md:w-1/3 h-48 md:h-auto bg-[#1a1a1a] relative flex items-center justify-center overflow-hidden">
                    {/* Placeholder Pattern */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-purple-900/20"></div>

                    {/* Icon/Logo Placeholder */}
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 backdrop-blur-sm z-10 group-hover:scale-110 transition-transform duration-500">
                        <Zap size={32} />
                    </div>
                </div>

                {/* Text Content Side */}
                <div className="p-6 flex-1 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                        Premium Void Access
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        Upgrade your transmission signal. Get priority ranking in the feed and exclusive neon themes.
                    </p>

                    <button className="self-start px-5 py-2 bg-white text-black text-xs font-bold rounded-full flex items-center gap-2 hover:bg-gray-200 transition-colors">
                        Learn More <ExternalLink size={12} />
                    </button>
                </div>

            </div>
        </div>
    );
}
