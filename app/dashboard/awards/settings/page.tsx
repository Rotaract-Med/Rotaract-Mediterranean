import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { hasPermission } from "@/lib/permissions"
import { AwardsSettingsForm } from "@/components/awards-settings-form"

export default async function AwardsSettingsPage() {
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

  const { data: mediaFiles } = await supabase
    .from("media_library")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Awards Page Settings</h1>
        <p className="text-gray-600 mt-2">Customize the year, title, and background image</p>
      </div>

      <AwardsSettingsForm settings={settings} mediaFiles={mediaFiles || []} />
    </div>
  )
}
