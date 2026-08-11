"use client"

import { useEffect, useState } from "react"
import type { Editor } from "@tiptap/react"
import { List } from "lucide-react"

interface TocItem {
  id: string
  textContent: string
  level: number
  isActive?: boolean
  isScrolledOver?: boolean
}

interface TableOfContentsPanelProps {
  editor: Editor
}

// Reads the live outline from @tiptap/extension-table-of-contents' own
// storage (kept current via TableOfContents.configure({ onUpdate }) in
// article-editor.tsx) rather than duplicating heading-tracking logic here.
export function TableOfContentsPanel({ editor }: TableOfContentsPanelProps) {
  const [items, setItems] = useState<TocItem[]>(
    () => editor.storage.tableOfContents?.content ?? []
  )

  useEffect(() => {
    const sync = () => setItems(editor.storage.tableOfContents?.content ?? [])
    sync()
    editor.on("update", sync)
    editor.on("selectionUpdate", sync)
    return () => {
      editor.off("update", sync)
      editor.off("selectionUpdate", sync)
    }
  }, [editor])

  if (items.length === 0) return null

  return (
    <div className="border-t p-1.5">
      <p className="px-1.5 pt-1.5 pb-1 text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        <List className="h-3.5 w-3.5" />
        Outline
      </p>
      <div className="space-y-0.5 max-h-56 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              const el = editor.view.dom.querySelector(`#${CSS.escape(item.id)}`)
              el?.scrollIntoView({ behavior: "smooth", block: "center" })
            }}
            className="block w-full truncate rounded px-2 py-1 text-left text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            style={{ paddingLeft: `${8 + (item.level - 1) * 10}px` }}
            title={item.textContent}
          >
            {item.textContent || "Untitled"}
          </button>
        ))}
      </div>
    </div>
  )
}
