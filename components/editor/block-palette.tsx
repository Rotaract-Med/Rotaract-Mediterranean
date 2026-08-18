"use client"

import type { Editor } from "@tiptap/react"
import { BLOCK_LIBRARY_ITEMS, BLOCK_PALETTE_DND_TYPE } from "@/components/editor/block-library"

interface BlockPaletteProps {
  editor: Editor
}

// Persistent sidebar of insertable block types. Drag one into the editor to
// insert it at the drop position (handled by BlockPaletteDrop), or click to
// insert at the current cursor - the same block library also powers the
// "/" popup menu (slash-command.tsx), so both stay in sync.
export function BlockPalette({ editor }: BlockPaletteProps) {
  return (
    <div className="w-44 shrink-0 border-r bg-gray-50/60 overflow-y-auto">
      <p className="px-3 pt-3 pb-1 text-xs font-medium text-muted-foreground">Blocks</p>
      <div className="p-1.5 space-y-0.5">
        {BLOCK_LIBRARY_ITEMS.map((item) => (
          <div
            key={item.title}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(BLOCK_PALETTE_DND_TYPE, item.title)
              e.dataTransfer.effectAllowed = "copy"
            }}
            onClick={() => {
              const { from } = editor.state.selection
              item.run(editor, { from, to: from })
            }}
            className="flex items-center gap-2 rounded px-2 py-1.5 text-sm cursor-grab select-none hover:bg-accent active:cursor-grabbing"
            title={item.description}
          >
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${item.chipClass}`}>
              <item.icon className="h-3.5 w-3.5" />
            </span>
            <span className="truncate">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
