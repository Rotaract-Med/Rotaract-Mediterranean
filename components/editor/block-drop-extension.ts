import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { BLOCK_LIBRARY_ITEMS, BLOCK_PALETTE_DND_TYPE } from "@/components/editor/block-library"

// Handles drops originating from BlockPalette's draggable list items.
// Ignores anything else (file drops, text drops, the DragHandle's own
// internal block-reorder drags) so those keep working through Tiptap's
// normal handling.
export const BlockPaletteDrop = Extension.create({
  name: "blockPaletteDrop",

  addProseMirrorPlugins() {
    const editor = this.editor

    return [
      new Plugin({
        key: new PluginKey("blockPaletteDrop"),
        props: {
          handleDOMEvents: {
            dragover(_view, event) {
              const dragEvent = event as DragEvent
              if (!dragEvent.dataTransfer?.types.includes(BLOCK_PALETTE_DND_TYPE)) {
                return false
              }
              dragEvent.preventDefault()
              dragEvent.dataTransfer.dropEffect = "copy"
              return true
            },
            drop(view, event) {
              const dragEvent = event as DragEvent
              const title = dragEvent.dataTransfer?.getData(BLOCK_PALETTE_DND_TYPE)
              if (!title) return false

              const item = BLOCK_LIBRARY_ITEMS.find((i) => i.title === title)
              if (!item) return false

              dragEvent.preventDefault()

              const coords = view.posAtCoords({ left: dragEvent.clientX, top: dragEvent.clientY })
              const pos = coords ? coords.pos : view.state.doc.content.size

              item.run(editor, { from: pos, to: pos })
              return true
            },
          },
        },
      }),
    ]
  },
})

export default BlockPaletteDrop
