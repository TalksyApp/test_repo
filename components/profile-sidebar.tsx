"use client"

import { Button } from "@/components/ui/button"
import { Share2, MapPin, Calendar, Cake } from "lucide-react"

interface ProfileSidebarProps {
    currentUser: any
    userPostsCount: number
    onEdit: () => void
}

export default function ProfileSidebar({ currentUser, userPostsCount, onEdit }: ProfileSidebarProps) {
    return (
        <div className="sticky top-24 space-y-4">
            {/* Profile Card */}
            <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                {/* Banner */}
                <div className="h-24 w-full relative">
                    {currentUser.bannerUrl ? (
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentUser.bannerUrl})` }}></div>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-black"></div>
                    )}
                </div>

                {/* Avatar & Info */}
                <div className="px-4 pb-4 -mt-12 relative z-10">
                    <div className="flex justify-between items-end mb-3">
                        <div className="w-20 h-20 rounded-2xl bg-[#0c0c0e] border-[4px] border-[#0c0c0e] overflow-hidden shadow-lg">
                            {currentUser.avatarUrl ? (
                                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-2xl font-bold text-zinc-700">
                                    {currentUser.username?.[0] || "U"}
                                </div>
                            )}
                        </div>

                        <Button size="icon" className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/5">
                            <Share2 size={14} />
                        </Button>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-white leading-tight">{currentUser.username}</h2>
                        <p className="text-gray-500 text-sm">@{currentUser.username?.toLowerCase()}</p>
                    </div>

                    {currentUser.bio && (
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-4">{currentUser.bio}</p>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-lg font-bold text-white">{userPostsCount}</div>
                            <div className="text-[10px] uppercase font-bold text-gray-500">Posts</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3">
                            <div className="text-lg font-bold text-white">0</div>
                            <div className="text-[10px] uppercase font-bold text-gray-500">Connections</div>
                        </div>
                    </div>

                    <div className="space-y-2 mb-4">
                        {currentUser.currentCity && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <MapPin size={12} /> <span>{currentUser.currentCity}</span>
                            </div>
                        )}
                        {currentUser.birthday && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Cake size={12} /> <span>{currentUser.birthday}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar size={12} /> <span>Joined Dec 2025</span>
                        </div>
                    </div>

                    <Button
                        onClick={onEdit}
                        className="w-full bg-white text-black font-bold hover:bg-gray-200 rounded-full h-10 shadow-lg"
                    >
                        Edit Profile
                    </Button>
                </div>
            </div>

            {/* Matrix Shortcut Card */}
            <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl p-4 shadow-xl">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Identity Matrix</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                        <span className="text-gray-400">Origin</span>
                        <span className="text-white font-medium">{currentUser.cityOfBirth || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                        <span className="text-gray-400">Zodiac</span>
                        <span className="text-white font-medium">{currentUser.zodiac || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Gender</span>
                        <span className="text-white font-medium">{currentUser.gender || "—"}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}
