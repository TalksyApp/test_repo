"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import FeedPage from "@/components/pages/feed-page"
import NotificationsPage from "@/components/pages/notifications-page"
import ProfilePage from "@/components/pages/profile-page"
import SettingsPage from "@/components/pages/settings-page"
import ExplorePage from "@/components/pages/explore-page" // Added Import
import type { User } from "@/lib/storage"

import AdminPanel from "@/components/admin/admin-panel"

export default function MainPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [activePage, setActivePage] = useState("feed")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null) // Added State
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ... (fetch logic remains same)

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`)
          if (response.ok) {
            const userData = await response.json()
            setCurrentUser(userData)
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (session?.user) {
      fetchUserData()
    }
  }, [session?.user])

  const handleLogout = () => {
    console.log("User logged out")
    // Implement actual logout logic here
  }

  // Guard clause for rendering pages that require user
  const renderPage = () => {
    if (!currentUser) return null; // Should be handled by loading state, but for type safety

    switch (activePage) {
      case "feed":
        return <FeedPage currentUser={currentUser} onNavigate={setActivePage} />
      case "explore":
        return <ExplorePage currentUser={currentUser} selectedTopic={selectedTopic} onTopicSelect={setSelectedTopic} onNavigateToGroups={() => setActivePage("groups")} />
      case "notifications":
        return <NotificationsPage />
      case "profile":
        return <ProfilePage currentUser={currentUser} onNavigate={setActivePage} onUserUpdate={(u) => setCurrentUser(u)} />
      case "settings":
        return <SettingsPage currentUser={currentUser} onNavigate={setActivePage} onLogout={handleLogout} />
      case "admin":
        return <AdminPanel currentUser={currentUser} onNavigate={setActivePage} />
      default:
        return <FeedPage currentUser={currentUser} onNavigate={setActivePage} />
    }
  }

  if (!session?.user) return null
  if (loading) return <div className="flex items-center justify-center h-full text-white">Loading...</div>
  if (!currentUser) return null

  // Ensure default FeedPage also gets props
  return <FeedPage currentUser={currentUser} onNavigate={setActivePage} />
}
