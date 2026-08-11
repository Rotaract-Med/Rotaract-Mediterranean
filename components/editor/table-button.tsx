"use client"

import { Table as TableIcon } from "lucide-react"
import type { Editor } from "@tiptap/react"
import { Button } from "@/components/tiptap-ui-primitive/button"

interface TableButtonProps {
  editor: Editor
}

// The official Tiptap UI registry has no table component - this hand-rolled
// button reuses their own Button primitive so it matches the rest of the
// toolbar, wired to @tiptap/extension-table's TableKit (added separately in
// ArticleEditor's extension list).
export function TableButton({ editor }: TableButtonProps) {
  const isActive = editor.isActive("table")

  return (
    <Button
      type="button"
      variant="ghost"
      data-active-state={isActive ? "on" : "off"}
      tabIndex={-1}
      aria-label="Insert table"
      aria-pressed={isActive}
      tooltip="Table"
      onClick={() =>
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
      }
    >
      <TableIcon className="tiptap-button-icon" />
    </Button>
  )
}
