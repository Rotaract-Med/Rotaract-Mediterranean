import { ArticleForm } from "@/components/article-form"

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Article</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Write a new article for MEDTimes</p>
      </div>
      <ArticleForm />
    </div>
  )
}
