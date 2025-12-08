"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import LiveBackground from "@/components/auth/live-background"

interface BackgroundContextType {
    isLiveBackgroundEnabled: boolean
    toggleBackground: () => void
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
    // Default to true (Nebula/Live mode)
    const [isLiveBackgroundEnabled, setIsLiveBackgroundEnabled] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Load preference from localStorage on mount
        const saved = localStorage.getItem("live-background-enabled")
        if (saved !== null) {
            setIsLiveBackgroundEnabled(JSON.parse(saved))
        }
        setMounted(true)
    }, [])

    const toggleBackground = () => {
        const newValue = !isLiveBackgroundEnabled
        setIsLiveBackgroundEnabled(newValue)
        localStorage.setItem("live-background-enabled", JSON.stringify(newValue))
    }

    if (!mounted) {
        return <>{children}</>
    }

    return (
        <BackgroundContext.Provider value={{ isLiveBackgroundEnabled, toggleBackground }}>
            {/* GLOBAL BACKGROUND LAYERS */}
            {isLiveBackgroundEnabled && (
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* 1. Particle System */}
                    <LiveBackground />

                    {/* 2. Nebula Gradients (ported from design App.tsx) */}
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/30 rounded-full blur-[100px] mix-blend-screen opacity-50 animate-pulse delay-1000"></div>
                </div>
            )}

            {/* Content sits above background */}
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </BackgroundContext.Provider>
    )
}

export function useBackground() {
    const context = useContext(BackgroundContext)
    if (context === undefined) {
        throw new Error("useBackground must be used within a BackgroundProvider")
    }
    return context
}
