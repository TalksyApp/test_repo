"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ProfilePage from "@/components/pages/profile-page"
import { type User } from "@/lib/storage"

// MOCK DATA GENERATOR (Temporary until Backend API is ready)
const getMockUser = (userId: string): User => {
    const isAlex = userId.toLowerCase() === 'alex_void';

    return {
        id: userId,
        username: isAlex ? "alex_void" : userId,
        email: `${userId}@void.com`,
        avatarUrl: isAlex ? undefined : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        bannerUrl: isAlex ? undefined : `https://picsum.photos/seed/${userId}/1200/400`,
        bio: isAlex ? "Traveler of the void. Exploring the digital frontier." : `Just another soul wandering the void. #${userId}`,
        currentCity: isAlex ? "Unknown" : "New Delhi, IN",
        gender: "Male",
        zodiac: isAlex ? "Scorpio" : "Leo",
        avatar_initials: isAlex ? "AV" : userId.substring(0, 2).toUpperCase(),
        followedTopics: ["Gaming", "Tech"]
    } as any;
}

export default function PublicProfileRoute() {
    const params = useParams()
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            // transform "alex_void" -> valid ID or fetch from API
            const userId = (Array.isArray(params.userId) ? params.userId[0] : params.userId) || '';

            try {
                // Try Fetching from API (if backend supported it)
                // const res = await fetch(`/api/users/${userId}`);

                // Simulating API Latency
                await new Promise(r => setTimeout(r, 600));

                // For now: Mock Data
                const mockData = getMockUser(userId);
                setUser(mockData);

            } catch (e) {
                console.error("Failed to load user", e);
            } finally {
                setLoading(false);
            }
        }

        if (params.userId) {
            fetchUser();
        }
    }, [params.userId])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-zinc-500 animate-pulse">
                <div className="w-16 h-16 bg-white/10 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-white/10 rounded"></div>
            </div>
        )
    }

    if (!user) return <div className="text-white text-center pt-20">User not found in the Void.</div>

    return (
        <ProfilePage
            currentUser={user}
            onNavigate={(page) => router.push(page === 'home' ? '/' : page)}
            isReadOnly={true}
        />
    )
}
