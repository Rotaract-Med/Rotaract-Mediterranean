import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { hasPermission } from "@/lib/permissions"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { HeroSlidesList } from "@/components/hero-slides-list"

export default async function HeroSlidesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || !hasPermission(profile.role, "media", "view")) {
    redirect("/dashboard")
  }

  const { data: slides, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("display_order", { ascending: true })

  console.log("[v0] Hero slides fetch result:", { slides, error })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Manage the homepage hero carousel slides</p>
        </div>
        {hasPermission(profile.role, "media", "create") && (
          <Link href="/dashboard/hero-slides/new">
            <Button className="bg-[#193fa6] hover:bg-[#142f7a]" size="sm">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add New Slide</span>
            </Button>
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          Error loading slides: {error.message}
        </div>
      )}

      <div className="grid gap-6">
        <HeroSlidesList
          slides={slides || []}
          canEdit={hasPermission(profile.role, "media", "edit")}
          canDelete={hasPermission(profile.role, "media", "delete")}
        />
      </div>
    </div>
  )
}
