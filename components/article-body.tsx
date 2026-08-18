import { sanitizeArticleHtml } from "@/lib/sanitize"
import "@/styles/tiptap-content.css"

interface ArticleBodyProps {
  content: string
  className?: string
}

// Shared by the public article page (app/medtimes/[slug]/page.tsx) and the
// dashboard draft preview so both are genuinely WYSIWYG with the editor.
export function ArticleBody({ content, className }: ArticleBodyProps) {
  return (
    <div
      className={
        className ??
        "prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#193fa6] prose-img:rounded-lg prose-img:shadow-lg"
      }
      dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(content) }}
    />
  )
}
