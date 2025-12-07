import { Heart, MessageCircle, Share2 } from "lucide-react"

export default function PhoneMockup() {
    return (
        // FIXED: bg-zinc-800 (lighter), border-zinc-600 (lighter), ring-4 (outline), shadow-xl (glow)
        <div className="relative w-[300px] h-[600px] bg-zinc-800 border-[8px] border-zinc-600 ring-4 ring-white/10 rounded-[40px] shadow-[0_0_100px_rgba(99,102,241,0.4)] overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-700 ease-out z-20">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-700 rounded-b-xl z-20"></div>

            {/* Screen Content */}
            <div className="w-full h-full bg-zinc-900 flex flex-col pt-10 px-4 space-y-4 relative overflow-hidden">
                {/* Status Bar */}
                <div className="flex justify-between items-center text-[10px] text-zinc-500 px-2">
                    <span>9:41</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 bg-zinc-700 rounded-full"></div>
                        <div className="w-3 h-3 bg-zinc-700 rounded-full"></div>
                    </div>
                </div>

                {/* Fake Posts */}
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-zinc-800/50 rounded-2xl p-3 space-y-2 animate-in slide-in-from-bottom duration-1000"
                        style={{ animationDelay: `${i * 200}ms` }}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20"></div>
                            <div className="h-2 w-20 bg-zinc-700 rounded-full"></div>
                        </div>
                        <div className="h-24 w-full bg-zinc-800 rounded-xl"></div>
                        <div className="flex gap-2">
                            <Heart size={14} className="text-zinc-600" />
                            <MessageCircle size={14} className="text-zinc-600" />
                            <Share2 size={14} className="text-zinc-600" />
                        </div>
                    </div>
                ))}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
            </div>
        </div>
    )
}
