import { createClient } from "@/lib/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye } from "lucide-react"
import Link from "next/link"
import { DeleteArticleButton } from "@/components/delete-article-button"
import { redirect } from "next/navigation"
import { hasPermission } from "@/lib/permissions"

// Revalidate dashboard every 10 seconds to show fresh data
export const revalidate = 10

export default async function ArticlesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  if (!hasPermission(profile?.role, "articles", "view")) {
    redirect("/dashboard")
  }

  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, category, content_type, status, featured_image, author_id, created_at, updated_at, published_at, article_type")
    .order("created_at", { ascending: false })

  const canCreate = hasPermission(profile?.role, "articles", "create")
  const canEdit = hasPermission(profile?.role, "articles", "edit")
  const canDelete = hasPermission(profile?.role, "articles", "delete")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Articles</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your MEDTimes content</p>
        </div>
        {canCreate && (
          <Link href="/dashboard/articles/new">
            <Button className="bg-[#193fa6] hover:bg-[#2563eb]" size="sm">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">New Article</span>
            </Button>
          </Link>
        )}
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading articles: {error.message}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {articles && articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge
                        variant={article.status === "published" ? "default" : "secondary"}
                        className={
                          article.status === "published"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {article.status}
                      </Badge>
                      <Badge variant="outline">{article.category}</Badge>
                      {article.content_type === 'newsletter' ? (
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">✉️ Newsletter</Badge>
                      ) : (
                        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">📰 Article</Badge>
                      )}
                      {article.article_type === 'pdf' ? (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">📄 PDF</Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">📝 Content</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{article.title}</CardTitle>
                    <CardDescription className="mt-2 text-sm">
                      {new Date(article.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {article.status === "published" && (
                      <Link href={`/medtimes/${article.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    {canEdit && (
                      <Link href={`/dashboard/articles/${article.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    {canDelete && <DeleteArticleButton articleId={article.id} />}
                  </div>
                </div>
              </CardHeader>
              {article.excerpt && (
                <CardContent>
                  <p className="text-gray-600 line-clamp-2">{article.excerpt}</p>
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">No articles yet</p>
              {canCreate && (
                <Link href="/dashboard/articles/new">
                  <Button className="bg-[#193fa6] hover:bg-[#2563eb]">
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first article
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
