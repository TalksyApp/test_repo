"use client"

import React, { useState, useEffect } from "react"
import { storage, type User, type Post } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import PostCard from "@/components/post-card"
import {
  MapPin, Cake, Ghost, Languages, User as UserIcon, GraduationCap,
  Home, Briefcase, Edit3, Grid, List, LucideIcon
} from "lucide-react"

interface ProfilePageProps {
  currentUser: any;
  onUserUpdate: (user: User) => void;
  onNavigate: (page: string, data?: any) => void;
}

interface MatrixItemProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  colSpan?: string;
}

const MatrixItem: React.FC<MatrixItemProps> = ({ icon: Icon, label, value, colSpan }) => (
  <div className={`bg-[#0a0a0a]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:border-white/20 hover:bg-[#0a0a0a]/80 transition-all duration-300 group ${colSpan || ''}`}>
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-xl bg-white/5 group-hover:bg-indigo-500/20 transition-colors">
        <Icon size={16} className="text-gray-400 group-hover:text-indigo-400 transition-colors" />
      </div>
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-lg font-medium text-white pl-1 break-words">
      {value || "Not set"}
    </div>
  </div>
);

export default function ProfilePage({ currentUser, onUserUpdate, onNavigate }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'identity'>('posts')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(currentUser)
  const [userPosts, setUserPosts] = useState<Post[]>([])

  useEffect(() => {
    // Fetch user's posts
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts?userId=${currentUser.id}`)
        if (response.ok) {
          const data = await response.json()
          // Transform API response to match Post interface
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
          // Exact match filter for current profile (in a real app, API would filter)
          const myPosts = transformedPosts.filter((p: Post) => p.userId === currentUser.id);
          setUserPosts(myPosts)
        }
      } catch (error) {
        console.error("Error fetching user posts:", error)
      }
    }
    fetchPosts()
  }, [currentUser.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    storage.setCurrentUser(formData)
    onUserUpdate(formData)
    setIsEditing(false)
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto pt-10 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700 px-6 h-full overflow-y-auto relative scrollbar-hide">

      {/* --- 1. HEADER CARD --- */}
      <div className="relative mb-12 group">
        {/* Banner */}
        <div className="h-72 w-full rounded-[48px] relative overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]">
          {/* Background Layer */}
          {currentUser.bannerUrl ? (
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentUser.bannerUrl})` }}></div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-900 to-black"></div>
          )}

          {/* Noise Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-transparent to-transparent opacity-80"></div>
        </div>

        {/* Avatar & Info Wrapper */}
        <div className="flex flex-col md:flex-row items-end px-12 -mt-24 gap-8 relative z-10">

          {/* Avatar */}
          <div className="relative group/avatar">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-indigo-500 blur-[50px] opacity-0 group-hover/avatar:opacity-40 transition-opacity duration-700 rounded-full"></div>

            <div className="w-44 h-44 rounded-[48px] bg-[#0a0a0a] border-[8px] border-[#000] flex items-center justify-center text-white font-bold text-7xl shadow-2xl overflow-hidden relative z-10">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 group-hover/avatar:opacity-40 transition-opacity"></div>
                  {currentUser.avatar_initials || "U"}
                </>
              )}
            </div>
          </div>

          {/* Name & Handle & Stats */}
          <div className="flex-1 mb-4 w-full">
            <h1 className="text-6xl font-black text-white tracking-tighter mb-1 drop-shadow-lg">{currentUser.username}</h1>
            <p className="text-gray-400 text-xl font-medium mb-5">@{currentUser.username?.toLowerCase() || "user"}</p>

            {/* Stats Row */}
            <div className="flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="font-black text-white text-xl">0</span>
                <span className="text-gray-500 font-medium group-hover:text-indigo-400 transition-colors">Connections</span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="font-black text-white text-xl">{userPosts.length}</span>
                <span className="text-gray-500 font-medium group-hover:text-indigo-400 transition-colors">Broadcasts</span>
              </div>
            </div>
          </div>

          {/* Edit Action */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-8 py-3.5 rounded-full bg-white text-black font-bold hover:scale-105 hover:bg-gray-100 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <Edit3 size={18} /> {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* --- 2. TABS --- */}
      <div className="flex items-center justify-center mb-12">
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-full flex gap-1 relative shadow-2xl">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'posts' ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-500 hover:text-white'}`}
          >
            <Grid size={16} /> Broadcasts
          </button>
          <button
            onClick={() => setActiveTab('identity')}
            className={`px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'identity' ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-500 hover:text-white'}`}
          >
            <List size={16} /> Info
          </button>
        </div>
      </div>

      {/* --- 3. CONTENT AREA --- */}
      <div className="min-h-[400px]">

        {/* POSTS TAB */}
        {activeTab === 'posts' && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            {userPosts.length > 0 ? (
              userPosts.map(post => (
                // Using PostCard for consistency, could be CompactPost
                <PostCard key={post.id} post={post} currentUser={currentUser} />
              ))
            ) : (
              <div className="col-span-full text-center py-24 border border-dashed border-white/10 rounded-[40px] bg-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
                  <Grid size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No broadcasts yet</h3>
                <p className="text-gray-500">Your thoughts will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* IDENTITY TAB */}
        {activeTab === 'identity' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isEditing ? (
              <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-8 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Matrix</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* IMAGES */}
                  <div className="col-span-full space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Banner Image URL</label>
                    <input name="bannerUrl" value={formData.bannerUrl || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" placeholder="https://..." />
                  </div>
                  <div className="col-span-full space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Avatar Image URL</label>
                    <input name="avatarUrl" value={formData.avatarUrl || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" placeholder="https://..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                    <input name="username" value={formData.username} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Current City</label>
                    <input name="currentCity" value={formData.currentCity || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
                  </div>
                  <div className="col-span-full space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Bio</label>
                    <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows={3} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">City of Birth</label>
                    <input name="cityOfBirth" value={formData.cityOfBirth || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
                  </div>
                  {/* NEW FIELDS */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Birthday</label>
                    <input type="date" name="birthday" value={formData.birthday || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Zodiac</label>
                    <input name="zodiac" value={formData.zodiac || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Gender</label>
                    <select name="gender" value={formData.gender || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none">
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Mother Tongue</label>
                    <input name="motherTongue" value={formData.motherTongue || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
                  </div>
                  <div className="col-span-full space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">School/College</label>
                    <input name="school" value={formData.school || ''} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleSave} className="bg-white text-black hover:bg-gray-200 px-8 rounded-full font-bold">Save Changes</Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4">
                <MatrixItem
                  icon={Briefcase} label="Bio"
                  value={currentUser.bio} colSpan="col-span-full"
                />
                <MatrixItem icon={Home} label="Current City" value={currentUser.currentCity} />
                <MatrixItem icon={MapPin} label="City of Birth" value={currentUser.cityOfBirth} />
                <MatrixItem icon={Cake} label="Birthday" value={currentUser.birthday} />
                <MatrixItem icon={Ghost} label="Zodiac" value={currentUser.zodiac} />
                <MatrixItem icon={UserIcon} label="Gender" value={currentUser.gender} />
                <MatrixItem icon={Languages} label="Mother Tongue" value={currentUser.motherTongue} />
                <MatrixItem
                  icon={GraduationCap} label="School/College"
                  value={currentUser.school} colSpan="col-span-full"
                />
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  )
}
