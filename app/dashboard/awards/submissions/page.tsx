import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { hasPermission } from "@/lib/permissions"
import { SubmissionsTable } from "@/components/submissions-table"

export default async function AwardsSubmissionsPage() {
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

  const { data: submissions } = await supabase
    .from("award_submissions")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Award Submissions</h1>
        <p className="text-gray-600 mt-2">Review and manage nominations from the community</p>
      </div>

      <SubmissionsTable submissions={submissions || []} isAdmin={profile.role === "admin"} />
    </div>
  )
}
