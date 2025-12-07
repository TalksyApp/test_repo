import { Sparkles } from "lucide-react"

export default function WelcomeHero() {
    return (
        <div className="relative flex flex-col items-center justify-center text-center p-12 animate-in fade-in zoom-in duration-700">
            <div className="w-32 h-32 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 relative">
                <Sparkles size={64} className="text-indigo-400 animate-pulse" />
                <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-ping duration-[3000ms]"></div>
            </div>
            <h2 className="text-5xl font-black text-white mb-6 tracking-tighter">
                Welcome to <br />{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                    Talksy
                </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-md leading-relaxed">
                Join the conversation. <br />
                Explore the void. <br />
                Connect with the world.
            </p>
        </div>
    )
}
