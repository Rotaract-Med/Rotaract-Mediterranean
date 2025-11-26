"use client"

import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import DashboardNav from "@/components/dashboard-nav"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role === "member") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav user={user} profile={profile} />
      <main className="flex-1 p-8 transition-all duration-300" style={{ marginLeft: "var(--sidebar-width, 256px)" }}>
        {children}
      </main>
      <style jsx global>{`
        :root {
          --sidebar-width: 256px;
        }
        @media (max-width: 1024px) {
          :root {
            --sidebar-width: 0px;
          }
        }
      `}</style>
    </div>
  )
}
