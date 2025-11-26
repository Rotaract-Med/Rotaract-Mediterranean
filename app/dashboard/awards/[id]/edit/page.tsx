import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { hasPermission } from "@/lib/permissions"
import { AwardBlockForm } from "@/components/award-block-form"

export default async function EditAwardBlockPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || !hasPermission(profile.role, "hero_slides", "edit")) {
    redirect("/dashboard")
  }

  const { data: block } = await supabase.from("awards_page_blocks").select("*").eq("id", params.id).single()

  if (!block) {
    redirect("/dashboard/awards")
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Block</h1>
        <p className="text-gray-600 mt-2">Update the content block</p>
      </div>

      <AwardBlockForm block={block} />
    </div>
  )
}
