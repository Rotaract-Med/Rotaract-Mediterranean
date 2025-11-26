import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { hasPermission } from "@/lib/permissions"
import { AwardBlockForm } from "@/components/award-block-form"

export default async function NewAwardBlockPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || !hasPermission(profile.role, "hero_slides", "create")) {
    redirect("/dashboard")
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Block</h1>
        <p className="text-gray-600 mt-2">Create a new content block for the awards page</p>
      </div>

      <AwardBlockForm />
    </div>
  )
}
