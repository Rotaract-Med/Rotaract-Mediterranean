import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { MedshopProjectsManager } from "@/components/medshop-projects-manager"

export default async function MedshopProjectsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Only admins can access this page
  if (!profile || profile.role !== 'admin') {
    redirect("/dashboard")
  }

  const { data: projects } = await supabase
    .from("medshop_projects")
    .select("*")
    .order("display_order")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">MedShop Projects</h1>
        <p className="text-gray-600 mt-2">
          Manage project links that appear in the MedShop dropdown menu
        </p>
      </div>

      <MedshopProjectsManager initialItems={projects || []} />
    </div>
  )
}
