import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { hasPermission } from "@/lib/permissions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Settings, Eye, FileText } from "lucide-react"

export default async function AwardsManagementPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || !hasPermission(profile.role, "hero_slides", "view")) {
    redirect("/dashboard")
  }

  const { data: settings } = await supabase.from("awards_settings").select("*").single()

  const { data: submissions } = await supabase
    .from("award_submissions")
    .select("*")
    .order("created_at", { ascending: false })

  const pendingCount = submissions?.filter((s) => s.status === "pending").length || 0
  const approvedCount = submissions?.filter((s) => s.status === "approved").length || 0

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Awards Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Manage awards page settings and submissions</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/awards" target="_blank">
            <Eye className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Preview Page</span>
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Submissions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{submissions?.length || 0}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{pendingCount}</p>
            </div>
            <FileText className="h-10 w-10 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{approvedCount}</p>
            </div>
            <FileText className="h-10 w-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/awards/settings"
          className="bg-gradient-to-br from-[#FFD700] to-[#D4AF37] rounded-lg p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        >
          <Settings className="h-12 w-12 text-black mb-4 group-hover:rotate-90 transition-transform duration-300" />
          <h2 className="text-2xl font-bold text-black mb-2">Page Settings</h2>
          <p className="text-black/80">Customize the year, title, and background image for the awards page</p>
          <div className="mt-4 text-sm text-black/70">
            Current Year: <span className="font-semibold">{settings?.year || "2024"}</span>
          </div>
        </Link>

        <Link
          href="/dashboard/awards/submissions"
          className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#D4AF37] rounded-lg p-8 hover:shadow-xl hover:shadow-[#FFD700]/20 transition-all duration-300 hover:scale-105 group"
        >
          <FileText className="h-12 w-12 text-[#FFD700] mb-4 group-hover:scale-110 transition-transform duration-300" />
          <h2 className="text-2xl font-bold text-white mb-2">View Submissions</h2>
          <p className="text-gray-400">Review and manage award nominations from the community</p>
          {pendingCount > 0 && (
            <div className="mt-4 inline-block bg-orange-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
              {pendingCount} pending review
            </div>
          )}
        </Link>
      </div>
    </div>
  )
}
