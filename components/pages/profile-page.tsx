"use client"

import React, { useState, useEffect } from "react"
import { storage, type User, type Post } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import PostCard from "@/components/post-card"
import EditProfileModal from "@/components/edit-profile-modal"
import ProfileSidebar from "@/components/profile-sidebar"
import {
  MapPin, Cake, Ghost, Languages, User as UserIcon, GraduationCap,
  Home, Briefcase, Edit3, Grid, List, LucideIcon, Share2, MessageCircle
} from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfilePageProps {
  currentUser: any;
  onUserUpdate: (user: User) => void;
  onNavigate: (page: string, data?: any) => void;
}

interface DataCardProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  delay?: string;
}

const DataCard: React.FC<DataCardProps> = ({ icon: Icon, label, value, delay }) => (
  <div className={`bg-[#121214]/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-blue-500/30 hover:bg-[#1a1a1c]/80 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4 ${delay || ''}`}>
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
      <Icon size={18} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
    </div>
    <div>
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">{label}</div>
      <div className="text-sm md:text-base font-semibold text-white">{value || "—"}</div>
    </div>
  </div>
);

export default function ProfilePage({ currentUser, onUserUpdate, onNavigate }: ProfilePageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('posts')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userPosts, setUserPosts] = useState<Post[]>([])

  useEffect(() => {
    // Fetch user's posts
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts?userId=${currentUser.id}`)
        if (response.ok) {
          const data = await response.json()
          // Transform API response
          const transformedPosts = data.map((post: any) => ({
            id: post.id,
            userId: post.user_id || '',
            content: post.content,
            timestamp: new Date(post.created_at).getTime(),
            likes: post.likes_count || 0,
            replies: [],
            comments: post.comments_count || 0,
            author: post.username,
            handle: `@${post.username}`,
            avatar: post.avatar_initials || post.username[0],
            tags: post.tags || [],
            isBoosted: post.is_boosted || false,
            isLikedByUser: post.is_liked_by_user || false
          }))
          const myPosts = transformedPosts.filter((p: Post) => p.userId === currentUser.id);
          setUserPosts(myPosts)
        }
      } catch (error) {
        console.error("Error fetching user posts:", error)
      }
    }
    fetchPosts()
  }, [currentUser.id])

  const handleUserUpdate = (updatedUser: any) => {
    storage.setCurrentUser(updatedUser)
    onUserUpdate(updatedUser)
  }

  return (
    <>
      <div className="w-full flex-1 overflow-y-auto relative scrollbar-hide pb-32">

        {/* ================================================================================== */}
        {/* HERO SECTION (SHARED & UNIFIED for Mobile/Desktop) */}
        {/* ================================================================================== */}
        <div className="relative w-full group">
          {/* BANNER */}
          <div className="h-48 md:h-80 w-full relative overflow-hidden">
            {currentUser.bannerUrl ? (
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${currentUser.bannerUrl})` }}></div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-black"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
          </div>

          {/* PROFILE CONTENT WRAPPER */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 -mt-20 md:-mt-32">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">

              {/* AVATAR */}
              <div className="relative group/avatar shrink-0">
                <div className="absolute -inset-4 bg-blue-500 rounded-[2.5rem] blur-2xl opacity-0 group-hover/avatar:opacity-40 transition-all duration-500"></div>
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] md:rounded-[2.5rem] bg-[#0c0c0e] border-[6px] border-[#050505] overflow-hidden relative z-10 shadow-2xl">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-5xl md:text-7xl font-bold text-zinc-700">
                      {currentUser.username?.[0] || "U"}
                    </div>
                  )}
                </div>
              </div>

              {/* INFO & ACTIONS (Desktop Row) */}
              <div className="flex-1 text-center md:text-left md:mb-4">
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-1 md:mb-2">{currentUser.username}</h1>
                <p className="text-gray-400 font-medium text-lg md:text-xl">@{currentUser.username?.toLowerCase() || "user"}</p>
              </div>

              {/* ACTION BUTTONS (Desktop) */}
              <div className="hidden md:flex items-center gap-4 mb-6">
                <Button onClick={() => setIsEditModalOpen(true)} className="h-12 rounded-full bg-white text-black font-bold hover:bg-zinc-200 px-8">
                  Edit Profile
                </Button>
                <Button size="icon" className="h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/5">
                  <Share2 size={20} />
                </Button>
              </div>
            </div>

            {/* BIO (Mobile Only - Desktop has it in sidebar) */}
            <div className="md:hidden mt-6 text-center">
              {currentUser.bio && <p className="text-gray-300 text-sm opacity-90 leading-relaxed">{currentUser.bio}</p>}

              {/* Mobile Stats */}
              <div className="flex items-center justify-center gap-10 mt-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-black text-white">{userPosts.length}</div>
                  <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-white">0</div>
                  <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">Connections</div>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex gap-4 justify-center mb-8">
                <Button onClick={() => setIsEditModalOpen(true)} className="flex-1 h-12 rounded-full bg-white text-black font-bold">Edit Profile</Button>
                <Button size="icon" className="h-12 w-12 rounded-full bg-white/10 text-white"><Share2 size={20} /></Button>
              </div>
            </div>
          </div>
        </div>


        {/* ================================================================================== */}
        {/* CONTENT GRID (Desktop Layout) */}
        {/* ================================================================================== */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* --- LEFT COL: IDENTITY SIDEBAR (Desktop) --- */}
          <div className="hidden md:flex col-span-4 flex-col gap-6">

            {/* About Card */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Grid size={18} className="text-blue-500" /> Identity Matrix
              </h3>

              {currentUser.bio && (
                <div className="mb-6 pb-6 border-b border-white/5">
                  <p className="text-gray-300 leading-relaxed">{currentUser.bio}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin size={16} /> <span className="text-sm">{currentUser.currentCity || "Unknown Loc"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Briefcase size={16} /> <span className="text-sm">{currentUser.bio || "Digital Nomad"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Ghost size={16} /> <span className="text-sm">{currentUser.zodiac || "Unknown Sign"}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                <div>
                  <div className="text-xl font-black text-white">{userPosts.length}</div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Posts</div>
                </div>
                <div>
                  <div className="text-xl font-black text-white">0</div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Friends</div>
                </div>
              </div>
            </div>

            {/* Badges / Extra (Placeholder) */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-6 h-48 flex items-center justify-center text-gray-600 font-medium">
              Identity Badges Coming Soon
            </div>
          </div>


          {/* --- RIGHT COL: FEED --- */}
          <div className="col-span-1 md:col-span-8">

            {/* Tabs */}
            <div className="flex items-center gap-3 mb-6 overflow-x-auto scrollbar-hide pb-2">
              {['posts', 'media', 'likes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold capitalize tracking-wide transition-all duration-200 shrink-0 ${activeTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Posts Feed */}
            <div className="space-y-4 pb-20">
              {userPosts.length > 0 ? (
                userPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onClick={() => router.push(`/post/${post.id}`)}
                    onComment={() => router.push(`/post/${post.id}`)}
                  />
                ))
              ) : (
                <div className="text-center py-24 border border-dashed border-white/10 rounded-[32px] bg-white/5">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Grid className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">No Broadcasts</h3>
                  <p className="text-gray-500 text-sm">Signal is silent.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={currentUser}
        onSave={handleUserUpdate}
      />
    </>
  )
}
