import { createClient } from "@/lib/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { GlobalBackground } from "@/components/global-Background"


// Cache this page for 60 seconds, then revalidate in background
export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createClient()
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt, featured_image")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single()

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: `${article.title} | MEDTimes`,
    description: article.excerpt || "Read this article on MEDTimes",
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.featured_image ? [article.featured_image] : [],
    },
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single()
    .then((res) => {
      // Tag this request for cache revalidation
      return res
    })

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden">
          <div className="absolute inset-0">
            <GlobalBackground />
          </div>

        <div className="relative h-full max-w-4xl mx-auto px-6 flex flex-col justify-end pb-16">
          <span
            className={`inline-block w-fit px-4 py-2 rounded-full text-sm font-semibold text-white mb-4 ${
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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">{article.title}</h1>
          <div className="flex items-center gap-6 text-white/80">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Rotaract Mediterranean
            </span>
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

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        {article.excerpt && (
          <p className="text-2xl text-gray-600 leading-relaxed mb-12 font-light italic border-l-4 border-[#193fa6] pl-6">
            {article.excerpt}
          </p>
        )}

        {article.article_type === 'pdf' && article.pdf_url ? (
          <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">PDF Document</span>
              </div>
              <a
                href={article.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#193fa6] text-white rounded-lg hover:bg-[#2563eb] transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </a>
            </div>
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
            <p className="mt-4 text-center text-sm text-gray-500">
              Having trouble viewing the PDF?{' '}
              <a
                href={article.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#193fa6] hover:underline font-medium"
              >
                Open in new tab
              </a>
            </p>
          </div>
        ) : (
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#193fa6] prose-img:rounded-lg prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}
      </article>

      {/* Back to MEDTimes */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Link
            href="/medtimes"
            className="inline-flex items-center gap-2 text-[#193fa6] font-semibold hover:gap-4 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to MEDTimes
          </Link>
        </div>
      </section>
    </div>
  )
}
