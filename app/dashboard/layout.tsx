import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import DashboardLayoutClient from "@/components/dashboard-layout-client"

// This is a Server Component - no "use client" directive
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side authentication check
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Redirect members to homepage
  if (profile?.role === "member") {
    redirect("/")
  }

  return (
    <DashboardLayoutClient user={user} profile={profile}>
      {children}
    </DashboardLayoutClient>
  )
}
