import { createClient } from "@/lib/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { hasPermission } from "@/lib/permissions"
import { ArticleBody } from "@/components/article-body"
import { GlobalBackground } from "@/components/global-Background"
import { ArrowLeft } from "lucide-react"

// Renders exactly what /medtimes/[slug] would show, but by id and without
// the `status = published` filter, so drafts can be reviewed before publishing.
export default async function ArticlePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  if (!hasPermission(profile?.role, "articles", "view")) {
    redirect("/dashboard")
  }

  const { data: article, error } = await supabase.from("articles").select("*").eq("id", id).single()

  if (error || !article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-amber-50 border-b border-amber-200 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <p className="text-sm text-amber-800">
            <strong>Preview</strong> &middot; status: <span className="font-medium">{article.status}</span> &middot; not
            the live page
          </p>
          <Link
            href={`/dashboard/articles/${article.id}/edit`}
            className="inline-flex items-center gap-1 text-sm text-amber-800 hover:text-amber-900 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to edit
          </Link>
        </div>
      </div>

      <section className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0">
          <GlobalBackground />
        </div>

        <div className="relative h-full max-w-4xl mx-auto px-6 flex flex-col justify-end pb-16">
          <div className="flex gap-2 mb-4">
            {article.content_type === "newsletter" && (
              <span className="inline-block w-fit px-4 py-2 rounded-full text-sm font-semibold text-white bg-[#9c27b0]">
                ✉️ Newsletter
              </span>
            )}
            <span
              className={`inline-block w-fit px-4 py-2 rounded-full text-sm font-semibold text-white ${
                article.category === "Culture"
                  ? "bg-[#00bcd4]"
                  : article.category === "Nature"
                    ? "bg-[#4caf50]"
                    : article.category === "Love"
                      ? "bg-[#e91e63]"
                      : article.category === "Events"
                        ? "bg-[#ff9800]"
                        : "bg-[#9c27b0]"
              }`}
            >
              {article.category}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">{article.title}</h1>
          <div className="flex items-center gap-6 text-white/80">
            <span>Rotaract Mediterranean</span>
            <span>
              {new Date(article.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-6 py-16">
        {article.excerpt && (
          <p className="text-2xl text-gray-600 leading-relaxed mb-12 font-light italic border-l-4 border-[#193fa6] pl-6">
            {article.excerpt}
          </p>
        )}

        {article.article_type === "pdf" && article.pdf_url ? (
          <div className="w-full border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
            <object
              data={article.pdf_url}
              type="application/pdf"
              className="w-full"
              style={{ height: "calc(100vh - 200px)", minHeight: "800px" }}
            >
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(article.pdf_url)}&embedded=true`}
                className="w-full"
                style={{ height: "calc(100vh - 200px)", minHeight: "800px" }}
                title={article.title}
              />
            </object>
          </div>
        ) : (
          <ArticleBody content={article.content} />
        )}
      </article>
    </div>
  )
}
