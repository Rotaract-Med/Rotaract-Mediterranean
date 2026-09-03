import { createClient } from "@/lib/server"
import Link from "next/link"
import { NewsletterForm } from "@/components/newsletter-form"
import { Navbar } from "@/components/navbar"
import { GlobalBackground } from "@/components/global-Background"

// Cache this page for 30 seconds, then revalidate in background
export const revalidate = 30

export default async function MEDTimesPage() {
  const supabase = await createClient()

  // Only fetch necessary fields, exclude large content field
  const { data: allContent } = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, category, content_type, featured_image, created_at, article_type")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  const featuredArticle = allContent?.[0]
  const remainingContent = allContent?.slice(1) || []
  const regularArticles = remainingContent.filter((item) => item.content_type !== "newsletter")
  const newsletters = remainingContent.filter((item) => item.content_type === "newsletter")

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="medtimes" />
      {/* Hero Section */}
      {featuredArticle && (
        <section className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0">
            <GlobalBackground />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-20">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-2 bg-[#193fa6] text-white text-sm font-semibold uppercase tracking-wider mb-4">
                {featuredArticle.content_type === "newsletter" ? "Featured Newsletter" : "Featured Story"}
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">{featuredArticle.title}</h1>
              <p className="text-xl text-white/90 mb-6 leading-relaxed">{featuredArticle.excerpt}</p>
              <div className="flex items-center gap-6 text-white/80 mb-8">
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
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(featuredArticle.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              {featuredArticle.slug ? (
                <Link
                  href={`/medtimes/${featuredArticle.slug}`}
                  className="relative z-10 inline-block px-8 py-4 bg-white text-[#193fa6] font-semibold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 cursor-pointer"
                >
                  Read Full Story
                </Link>
              ) : (
                <div className="relative z-10 inline-block px-8 py-4 bg-gray-300 text-gray-600 font-semibold rounded-full cursor-not-allowed">
                  No Slug Available
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Magazine Header */}
      <section className="bg-[#193fa6] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-6xl font-script mb-2">MEDTimes</h2>
              <p className="text-white/80 text-lg">Stories that connect the Mediterranean</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm uppercase tracking-wider">Latest Stories</span>
              <span className="text-white/60">|</span>
              <span className="text-sm uppercase tracking-wider">{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article: any) => (
            <Link key={article.id} href={`/medtimes/${article.slug}`}>
              <article className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${article.category === "Culture"
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
                    {article.article_type === 'pdf' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-red-600 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        PDF
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#193fa6] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-4 leading-relaxed flex-grow">{article.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <span className="font-medium">Rotaract Mediterranean</span>
                    <span>
                      {new Date(article.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {regularArticles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No articles published yet.</p>
            <p className="text-gray-500 mt-2">Check back soon for new stories!</p>
          </div>
        )}
      </section>

      {/* Newsletters Section */}
      {newsletters.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-16 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-7 h-7 text-[#9c27b0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900">Newsletters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsletters.map((item: any) => (
              <Link key={item.id} href={`/medtimes/${item.slug}`}>
                <article className="group cursor-pointer bg-purple-50/50 border border-purple-100 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#9c27b0] flex items-center gap-1">
                        ✉️ Newsletter
                      </span>
                      {item.article_type === "pdf" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-red-600 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          PDF
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#9c27b0] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-4 leading-relaxed flex-grow">{item.excerpt}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-purple-100">
                      <span className="font-medium">Rotaract Mediterranean</span>
                      <span>
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Email Subscribe Section */}
      <section className="bg-gradient-to-br from-[#193fa6] to-[#0d2d6e] text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-script mb-4">Stay Connected</h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Get the latest stories from across the Mediterranean delivered to your inbox every week.
          </p>

          <NewsletterForm />

          <p className="text-sm text-white/70 mt-6">
            Join thousands of Rotaractors staying informed about Mediterranean initiatives
          </p>
        </div>
      </section>

      {/* Back to Home */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#193fa6] font-semibold hover:gap-4 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
