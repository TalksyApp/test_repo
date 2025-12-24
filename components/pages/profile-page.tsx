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
  <div className={`bg-[#121214]/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-indigo-500/30 hover:bg-[#1a1a1c]/80 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4 ${delay || ''}`}>
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all">
      <Icon size={18} className="text-gray-400 group-hover:text-indigo-400 transition-colors" />
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
        {/* MOBILE LAYOUT (Cinematic App View) - Visible only on Mobile */}
        {/* ================================================================================== */}
        <div className="block md:hidden">
          {/* --- HERO SECTION --- */}
          <div className="relative w-full group">

            {/* BANNER */}
            <div className="h-48 md:h-64 w-full relative overflow-hidden">
              {currentUser.bannerUrl ? (
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${currentUser.bannerUrl})` }}></div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-black"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>

            {/* PROFILE HEADER INFO (Centered Layout) */}
            <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center -mt-20 md:-mt-28 gap-6 text-center">

              {/* AVATAR */}
              <div className="relative group/avatar shrink-0">
                {/* Glow effect */}
                <div className="hidden md:block absolute -inset-4 bg-indigo-500 rounded-full blur-2xl opacity-0 group-hover/avatar:opacity-30 transition-all duration-500"></div>

                <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] md:rounded-[2.5rem] bg-[#0c0c0e] border-[6px] border-black overflow-hidden relative z-10 shadow-2xl">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-5xl md:text-7xl font-bold text-zinc-700">
                      {currentUser.username?.[0] || "U"}
                    </div>
                  )}
                </div>
              </div>

              {/* TEXT INFO (Name & Bio) */}
              <div className="flex-1 w-full flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2 drop-shadow-xl">{currentUser.username}</h1>
                <p className="text-gray-400 font-medium text-lg md:text-xl mb-4">@{currentUser.username?.toLowerCase() || "user"}</p>

                {currentUser.bio && (
                  <p className="text-gray-300 text-sm md:text-base max-w-lg mx-auto leading-relaxed opacity-90 mb-6">{currentUser.bio}</p>
                )}

                {/* STATS */}
                <div className="flex items-center justify-center gap-10 md:gap-12 mb-8">
                  <div className="text-center group cursor-pointer hover:scale-105 transition-transform">
                    <div className="text-2xl md:text-3xl font-black text-white tracking-tight">{userPosts.length}</div>
                    <div className="text-[10px] md:text-xs uppercase font-bold text-gray-500 tracking-widest mt-1 group-hover:text-indigo-400">Posts</div>
                  </div>
                  <div className="text-center group cursor-pointer hover:scale-105 transition-transform">
                    <div className="text-2xl md:text-3xl font-black text-white tracking-tight">0</div>
                    <div className="text-[10px] md:text-xs uppercase font-bold text-gray-500 tracking-widest mt-1 group-hover:text-indigo-400">Connections</div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-4 w-full md:w-auto justify-center">
                  <Button
                    onClick={() => setIsEditModalOpen(true)}
                    className="h-12 md:h-14 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] px-10 text-base hover:scale-105 active:scale-95"
                  >
                    Edit Profile
                  </Button>
                  <Button size="icon" className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/5 backdrop-blur-md hover:scale-105 active:scale-95 transition-all">
                    <Share2 size={22} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* --- TABS (Capsule Style) --- */}
          <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl py-4 flex justify-center mt-2">
            <div className="flex p-1 bg-white/5 border border-white/5 rounded-full relative">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-8 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2 ${activeTab === 'posts' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105' : 'text-gray-500 hover:text-white'}`}
              >
                Broadcasts
              </button>
              <button
                onClick={() => setActiveTab('identity')}
                className={`px-8 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2 ${activeTab === 'identity' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105' : 'text-gray-500 hover:text-white'}`}
              >
                Identity Matrix
              </button>
            </div>
          </div>

          {/* --- CONTENT AREA --- */}
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 min-h-[500px]">

            {/* POSTS TAB */}
            {activeTab === 'posts' && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
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
                  <div className="text-center py-20 border border-dashed border-white/10 rounded-[32px] bg-white/5">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Grid className="text-gray-500" />
                    </div>
                    <div className="text-lg font-medium text-white">No transmissions yet</div>
                    <div className="text-sm text-gray-500">Static silence...</div>
                  </div>
                )}
              </div>
            )}

            {/* IDENTITY TAB */}
            {activeTab === 'identity' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <DataCard icon={Briefcase} label="Bio Status" value={currentUser.bio || "Unknown"} delay="duration-300" />
                <DataCard icon={Home} label="Current City" value={currentUser.currentCity} delay="duration-400" />
                <DataCard icon={MapPin} label="Origin" value={currentUser.cityOfBirth} delay="duration-500" />
                <DataCard icon={Cake} label="Cycle Start" value={currentUser.birthday} delay="duration-600" />
                <DataCard icon={Ghost} label="Zodiac" value={currentUser.zodiac} delay="duration-700" />
                <DataCard icon={UserIcon} label="Gender" value={currentUser.gender} delay="duration-800" />
                <DataCard icon={Languages} label="Tongue" value={currentUser.motherTongue} delay="duration-900" />
                <DataCard icon={GraduationCap} label="Academia" value={currentUser.school} delay="duration-1000" />
              </div>
            )}
          </div>
        </div>


        {/* ================================================================================== */}
        {/* DESKTOP LAYOUT (Reddit Style) - Visible only on Desktop */}
        {/* ================================================================================== */}
        <div className="hidden md:grid grid-cols-12 gap-4 max-w-[1100px] mx-auto mt-8 px-6 min-h-screen">

          {/* --- LEFT COL: FEED & TABS --- */}
          <div className={`${activeTab === 'posts' ? 'col-span-12 max-w-3xl mx-auto w-full' : 'col-span-8'}`}>

            {/* Sticky Header: Title + Tabs */}
            <div className="sticky top-0 z-30 bg-black/60 backdrop-blur-xl -mx-6 px-6 pt-8 pb-4 mb-6 rounded-b-[2rem]">
              {/* Page Title */}
              <div className="mb-6">
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">Profile</h1>
              </div>

              {/* Desktop Capsule Tabs */}
              <div className="flex items-center gap-3 transition-all overflow-x-auto scrollbar-hide">
                {['overview', 'posts', 'comments', 'saved'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold capitalize tracking-wide transition-all duration-200 shrink-0 ${activeTab === tab
                      ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-105'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Feed Content */}
            <div className="space-y-4">
              {(activeTab === 'posts' || activeTab === 'overview') ? (
                userPosts.length > 0 ? (
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
                  <div className="text-center py-32 border border-dashed border-white/10 rounded-2xl bg-[#0c0c0e]">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Grid className="text-gray-500 w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No broadcasts yet</h3>
                    <p className="text-gray-500">When you post, it will show up here.</p>
                    <Button onClick={() => onNavigate('create')} className="mt-6 rounded-full bg-white text-black hover:bg-gray-200">Create Post</Button>
                  </div>
                )
              ) : (
                /* Placeholder for other tabs */
                <div className="text-center py-32 border border-dashed border-white/10 rounded-2xl bg-[#0c0c0e]">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    {activeTab === 'comments' && <MessageCircle className="text-gray-500 w-8 h-8" />}
                    {activeTab === 'saved' && <List className="text-gray-500 w-8 h-8" />}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No {activeTab} yet</h3>
                  <p className="text-gray-500 text-sm">Check back later for updates.</p>
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT COL: SIDEBAR --- */}
          {activeTab !== 'posts' && (
            <div className="col-span-4 h-fit">
              <ProfileSidebar
                currentUser={currentUser}
                userPostsCount={userPosts.length}
                onEdit={() => setIsEditModalOpen(true)}
              />
            </div>
          )}

        </div>

      </div>

      {/* --- EDIT MODAL --- */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={currentUser}
        onSave={handleUserUpdate}
      />
    </>
  )
}
