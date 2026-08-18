import type { ComponentType } from "react"
import type { Editor, Range } from "@tiptap/react"
import {
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code2,
  Minus,
  Image as ImageIcon,
  Table as TableIcon,
  ChevronRight,
  Youtube,
  Columns2,
} from "lucide-react"

export interface BlockLibraryItem {
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  keywords: string[]
  // Tailwind classes for the icon's chip background + text color, e.g.
  // "bg-blue-100 text-blue-600" - grouped by block category so the palette
  // and slash menu read at a glance instead of an all-gray icon list.
  chipClass: string
  // `range` is the text to replace (e.g. the "/query" the user typed) for
  // the slash menu, or a zero-length range at the drop position for the
  // block palette's drag-and-drop insert - deleteRange on a zero-length
  // range is a no-op, so the same `run` works for both callers.
  run: (editor: Editor, range: Range) => void
}

// Single source of truth for both the "/" slash menu (slash-command.tsx)
// and the drag-from-sidebar block palette (block-palette.tsx), so the two
// insertion surfaces can never drift out of sync with each other.
export const BLOCK_LIBRARY_ITEMS: BlockLibraryItem[] = [
  {
    title: "Text",
    description: "Plain paragraph",
    icon: Pilcrow,
    keywords: ["paragraph", "text", "p"],
    chipClass: "bg-slate-100 text-slate-600",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  {
    title: "Heading 1",
    description: "Big section heading",
    icon: Heading1,
    keywords: ["h1", "title"],
    chipClass: "bg-blue-100 text-blue-600",
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: Heading2,
    keywords: ["h2", "subtitle"],
    chipClass: "bg-blue-100 text-blue-600",
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: Heading3,
    keywords: ["h3"],
    chipClass: "bg-blue-100 text-blue-600",
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run(),
  },
  {
    title: "Bullet List",
    description: "Unordered list",
    icon: List,
    keywords: ["ul", "bullet", "list"],
    chipClass: "bg-emerald-100 text-emerald-600",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    description: "Ordered list",
    icon: ListOrdered,
    keywords: ["ol", "ordered", "numbered"],
    chipClass: "bg-emerald-100 text-emerald-600",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Task List",
    description: "Checklist with checkboxes",
    icon: ListTodo,
    keywords: ["todo", "checkbox", "task"],
    chipClass: "bg-emerald-100 text-emerald-600",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "Quote",
    description: "Blockquote",
    icon: Quote,
    keywords: ["blockquote", "quote", "citation"],
    chipClass: "bg-purple-100 text-purple-600",
    run: (editor, range) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Code Block",
    description: "Monospaced code block",
    icon: Code2,
    keywords: ["code", "pre", "snippet"],
    chipClass: "bg-slate-800 text-slate-100",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setCodeBlock().run(),
  },
  {
    title: "Divider",
    description: "Horizontal rule",
    icon: Minus,
    keywords: ["hr", "divider", "separator", "line"],
    chipClass: "bg-slate-100 text-slate-500",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "Image",
    description: "Upload or embed an image",
    icon: ImageIcon,
    keywords: ["picture", "photo", "upload", "img"],
    chipClass: "bg-rose-100 text-rose-600",
    run: (editor, range) =>
      editor.chain().focus().deleteRange(range).setImageUploadNode().run(),
  },
  {
    title: "Table",
    description: "3x3 table",
    icon: TableIcon,
    keywords: ["grid", "table"],
    chipClass: "bg-amber-100 text-amber-600",
    run: (editor, range) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
  {
    title: "Toggle",
    description: "Collapsible section",
    icon: ChevronRight,
    keywords: ["toggle", "collapse", "details", "accordion", "expand"],
    chipClass: "bg-indigo-100 text-indigo-600",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setDetails().run(),
  },
  {
    title: "Video",
    description: "Embed a YouTube video",
    icon: Youtube,
    keywords: ["youtube", "video", "embed"],
    chipClass: "bg-red-100 text-red-600",
    run: (editor, range) => {
      const url = window.prompt("YouTube video URL:")
      if (!url) return
      editor.chain().focus().deleteRange(range).setYoutubeVideo({ src: url }).run()
    },
  },
  {
    title: "Columns",
    description: "Two side-by-side columns",
    icon: Columns2,
    keywords: ["columns", "layout", "side by side", "two column"],
    chipClass: "bg-cyan-100 text-cyan-600",
    run: (editor, range) => editor.chain().focus().deleteRange(range).setColumns().run(),
  },
]

export function filterBlockLibraryItems(query: string): BlockLibraryItem[] {
  const q = query.toLowerCase().trim()
  if (!q) return BLOCK_LIBRARY_ITEMS
  return BLOCK_LIBRARY_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(q) || item.keywords.some((k) => k.includes(q))
  )
}

// Custom drag-and-drop MIME type used to identify drags originating from
// the block palette, as opposed to file drags, text drags, or the editor's
// own internal block-reorder drags (DragHandle).
export const BLOCK_PALETTE_DND_TYPE = "application/x-tiptap-block-title"
