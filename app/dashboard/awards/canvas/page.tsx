import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { hasPermission } from "@/lib/permissions"
import { WixPageBuilder } from "@/components/wix-page-builder"

export default async function CanvasBuilderPage() {
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

  const { data: elements } = await supabase
    .from("awards_canvas_elements")
    .select("*")
    .order("z_index", { ascending: true })

  const { data: mediaLibrary } = await supabase.from("media_library").select("*")

  return (
    <div className="h-screen overflow-hidden">
      <WixPageBuilder initialElements={elements || []} mediaLibrary={mediaLibrary || []} />
    </div>
  )
}
