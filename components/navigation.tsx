"use client"

import type { User } from "@/lib/storage"
import { Home, Compass, Bell, User as UserIcon, Settings, LucideIcon, Shield } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavigationProps {
  currentUser?: User
}

interface NavItemProps {
  href: string
  icon: LucideIcon
  pathname: string
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, pathname }) => {
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 relative group
        ${isActive
          ? "text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          : "text-gray-500 hover:bg-white/5 hover:text-white hover:scale-110"
        }`}
    >
      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />

      {/* Hover Tooltip Glow */}
      {isActive && <div className="absolute inset-0 bg-white/20 blur-lg rounded-full opacity-50"></div>}
    </Link>
  )
}

export default function Navigation({ currentUser }: NavigationProps) {
  const pathname = usePathname()

  return (
    // GLASS DOCK STYLE - RESPONSIVE
    <div className="fixed z-50 bottom-4 left-4 right-4 h-20 bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/10 rounded-[32px] flex flex-row justify-around items-center px-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] md:fixed md:left-6 md:top-1/2 md:-translate-y-1/2 md:right-auto md:bottom-auto md:w-[80px] md:h-auto md:flex-col md:gap-5 md:py-6 md:rounded-[40px] md:px-3">
      <NavItem href="/" icon={Home} pathname={pathname} />
      <NavItem href="/explore" icon={Compass} pathname={pathname} />
      <NavItem href="/notifications" icon={Bell} pathname={pathname} />
      <NavItem href="/profile" icon={UserIcon} pathname={pathname} />

      {/* ADMIN LINK (Only for Admin) */}
      {currentUser?.email === 'admin@talksy.app' && (
        <>
          <div className="hidden md:block h-px w-8 bg-white/10 my-2"></div> {/* Desktop Divider */}
          <NavItem href="/admin" icon={Shield} pathname={pathname} />
        </>
      )}

      <div className="hidden md:block h-px w-8 bg-white/10 my-2"></div> {/* Desktop Divider */}

      <div className="md:mt-auto">
        <NavItem href="/settings" icon={Settings} pathname={pathname} />
      </div>
    </div>
  )
}
