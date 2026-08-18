"use client"

import { ArticleBody } from "@/components/article-body"

interface LivePreviewPanelProps {
  content: string
}

// Live preview of the article body using the exact same component
// (components/article-body.tsx) the public /medtimes/[slug] page and the
// dashboard draft preview render with - so what's shown here is genuinely
// how it will look once published, not a re-approximation of the styling.
export function LivePreviewPanel({ content }: LivePreviewPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b bg-gray-50/60 px-4 py-2">
        <p className="text-xs font-medium text-muted-foreground">Preview</p>
        <p className="text-xs text-muted-foreground/70">How this will look on the site</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {content.trim() ? (
          <ArticleBody
            content={content}
            className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#193fa6] prose-img:rounded-lg prose-img:shadow-sm"
          />
        ) : (
          <p className="text-sm text-muted-foreground italic">Nothing to preview yet - start writing.</p>
        )}
      </div>
    </div>
  )
}
