import { createClient } from "@/lib/server"
import { ArticleForm } from "@/components/article-form"
import { notFound, redirect } from "next/navigation"
import { hasPermission } from "@/lib/permissions"

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // Fetch article - this is OK to include content since it's a single article
  const { data: article, error } = await supabase.from("articles").select("*").eq("id", id).single()

  if (error || !article) {
    console.error("Error loading article:", error)
    notFound()
  }

  const canEdit = hasPermission(profile?.role, "articles", "edit")

  if (!canEdit) {
    redirect("/dashboard/articles")
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-x-hidden">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Article</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Update your MEDTimes article</p>
      </div>
      <ArticleForm article={article} />
    </div>
  )
}
