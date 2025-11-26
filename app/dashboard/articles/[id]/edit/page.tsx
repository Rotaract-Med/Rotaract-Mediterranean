import { createClient } from "@/lib/server"
import { ArticleForm } from "@/components/article-form"
import { notFound } from "next/navigation"

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch article - this is OK to include content since it's a single article
  const { data: article, error } = await supabase.from("articles").select("*").eq("id", id).single()

  if (error || !article) {
    console.error("Error loading article:", error)
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Article</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Update your MEDTimes article</p>
      </div>
      <ArticleForm article={article} />
    </div>
  )
}
