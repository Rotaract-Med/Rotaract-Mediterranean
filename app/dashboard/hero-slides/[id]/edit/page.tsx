import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { hasPermission } from "@/lib/permissions"
import HeroSlideForm from "@/components/hero-slide-form"

export default async function EditHeroSlidePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || !hasPermission(profile.role, "media", "edit")) {
    redirect("/dashboard")
  }

  const { data: slide } = await supabase.from("hero_slides").select("*").eq("id", params.id).single()

  if (!slide) {
    redirect("/dashboard/hero-slides")
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Hero Slide</h1>
        <p className="text-gray-600 mt-2">Update the hero carousel slide</p>
      </div>

      <HeroSlideForm slide={slide} />
    </div>
  )
}
