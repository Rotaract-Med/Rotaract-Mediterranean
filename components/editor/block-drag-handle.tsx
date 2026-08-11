"use client"

import { DragHandle } from "@tiptap/extension-drag-handle-react"
import type { Editor } from "@tiptap/react"
import { GripVertical } from "lucide-react"

const NESTED_CONFIG = { edgeDetection: { threshold: -16 } }

// Must be a stable reference (module-level, not an inline object literal).
// DragHandle's internal useEffect depends on this object by identity and
// tears down + re-registers its ProseMirror plugin whenever it changes -
// which, as a side effect of ProseMirror's plugin-view lifecycle, destroys
// every OTHER plugin's view too, including the slash-command/emoji-command
// suggestion popups. A fresh object literal here reran that teardown on
// every single keystroke, silently killing any open popup before it could
// render.
const COMPUTE_POSITION_CONFIG = { placement: "left-start" as const, strategy: "fixed" as const }

interface BlockDragHandleProps {
  editor: Editor
}

// Hover any block to reveal a grip handle on the left; drag to reorder,
// click to select the whole block. Built directly on Tiptap's own (free,
// MIT) drag-handle extension rather than their CLI-scaffolded
// DragContextMenu component, whose registry install hung indefinitely in
// this environment - the underlying mechanism is identical either way.
export function BlockDragHandle({ editor }: BlockDragHandleProps) {
  return (
    <DragHandle
      editor={editor}
      nested={NESTED_CONFIG}
      // fixed (not the default absolute) so the handle can't get clipped by
      // an overflow-hidden ancestor - e.g. this editor's own rounded-corner
      // wrapper, or the dashboard's scrollable content area.
      computePositionConfig={COMPUTE_POSITION_CONFIG}
    >
      <div className="flex h-6 w-5 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-accent-foreground active:cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </div>
    </DragHandle>
  )
}
