import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { hasPermission } from "@/lib/permissions"
import { EventsSubmenuManager } from "@/components/events-submenu-manager"

export default async function EventsSubmenuPage() {
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

  const { data: submenuItems } = await supabase
    .from("events_submenu")
    .select("*")
    .order("display_order")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Events Submenu</h1>
        <p className="text-gray-600 mt-2">
          Manage navigation links that appear in the Events dropdown menu
        </p>
      </div>

      <EventsSubmenuManager initialItems={submenuItems || []} />
    </div>
  )
}
