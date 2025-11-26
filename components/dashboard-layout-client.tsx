"use client"

import type React from "react"

import { useEffect, useState } from "react"
import DashboardNav from "./dashboard-nav"

interface DashboardLayoutClientProps {
  user: any
  profile: any
  children: React.ReactNode
}

export default function DashboardLayoutClient({ user, profile, children }: DashboardLayoutClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Sync collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setIsCollapsed(savedState === "true")
    }

    // Listen for changes to localStorage (when DashboardNav updates it)
    const handleStorageChange = () => {
      const savedState = localStorage.getItem("sidebarCollapsed")
      if (savedState !== null) {
        setIsCollapsed(savedState === "true")
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom event from same window
    const handleCollapsedChange = (e: CustomEvent) => {
      setIsCollapsed(e.detail.isCollapsed)
    }

    window.addEventListener("sidebarCollapsedChange" as any, handleCollapsedChange as any)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("sidebarCollapsedChange" as any, handleCollapsedChange as any)
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav user={user} profile={profile} />
      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-64"} overflow-x-hidden w-full`}>
        {children}
      </main>
    </div>
  )
}
