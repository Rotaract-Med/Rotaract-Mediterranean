"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  FileText,
  Users,
  ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Award,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"

interface DashboardNavProps {
  user: any
  profile: any
}

export default function DashboardNav({ user, profile }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMediaControlOpen, setIsMediaControlOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setIsCollapsed(savedState === "true")
    }
  }, [])

  const toggleCollapsed = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebarCollapsed", String(newState))

    window.dispatchEvent(
      new CustomEvent("sidebarCollapsedChange", {
        detail: { isCollapsed: newState },
      }),
    )
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const navItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "journalist", "media_team", "member"],
    },
    {
      name: "Articles",
      href: "/dashboard/articles",
      icon: FileText,
      roles: ["admin", "journalist"],
    },
    {
      name: "Team",
      href: "/dashboard/team",
      icon: Users,
      roles: ["admin"],
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["admin", "journalist", "media_team", "member"],
    },
  ]

  const mediaControlItems = [
    {
      name: "Hero Slides",
      href: "/dashboard/hero-slides",
      icon: ImageIcon,
      roles: ["admin", "media_team"],
    },
    {
      name: "Media Library",
      href: "/dashboard/media",
      icon: FolderOpen,
      roles: ["admin", "media_team"],
    },
    {
      name: "Awards",
      href: "/dashboard/awards",
      icon: Award,
      roles: ["admin", "media_team"],
    },
  ]

  const filteredNavItems = navItems.filter((item) => item.roles.includes(profile?.role || "member"))
  const filteredMediaItems = mediaControlItems.filter((item) => item.roles.includes(profile?.role || "member"))
  const showMediaControl = filteredMediaItems.length > 0

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-40 ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Logo */}
        <div className={`border-b border-gray-200 ${isCollapsed ? "p-4" : "p-6"}`}>
          {!isCollapsed ? (
            <Link href="/" className="block">
              <img src="/images/Blue.png" alt="Rotaract Mediterranean" className="h-40 -my-16 w-auto" />
            </Link>
          ) : (
            <Link href="/" className="flex justify-center">
              <img src="/images/Blue.png" alt="Rotaract Mediterranean" className="h-12 w-auto" />
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center rounded-lg transition-colors ${
                  isActive ? "bg-[#193fa6] text-white" : "text-gray-700 hover:bg-gray-100"
                } ${isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"}`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            )
          })}

          {showMediaControl && (
            <div className="space-y-1">
              <button
                onClick={() => !isCollapsed && setIsMediaControlOpen(!isMediaControlOpen)}
                className={`flex items-center rounded-lg transition-colors text-gray-700 hover:bg-gray-100 w-full ${
                  isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
                }`}
                title={isCollapsed ? "Media Control" : undefined}
              >
                <ImageIcon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="font-medium flex-1 text-left">Media Control</span>
                    {isMediaControlOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </>
                )}
              </button>

              {!isCollapsed && isMediaControlOpen && (
                <div className="ml-4 space-y-1">
                  {filteredMediaItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                          isActive ? "bg-[#193fa6] text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Collapse/Expand Button */}
        <div className={`border-t border-gray-200 ${isCollapsed ? "p-2" : "p-4"}`}>
          <Button
            onClick={toggleCollapsed}
            variant="ghost"
            className="w-full"
            size={isCollapsed ? "icon" : "sm"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <>
                <PanelLeftClose className="h-5 w-5 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>

        {/* User profile */}
        <div className={`border-t border-gray-200 ${isCollapsed ? "p-2" : "p-4"}`}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-[#193fa6] text-white">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-gray-500 capitalize">{profile?.role || "member"}</p>
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-[#193fa6] text-white text-xs">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button onClick={handleLogout} variant="ghost" size="icon" title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden fixed inset-0 bg-black/50 z-30" />
      )}
    </>
  )
}
