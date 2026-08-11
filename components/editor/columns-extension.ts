import { Node, mergeAttributes } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    columns: {
      /** Insert a 2-column layout block at the current position. */
      setColumns: () => ReturnType
    }
  }
}

// No official Tiptap extension covers this (the closest fit, TableKit, is
// built for tabular data - merged cells, headers, row/column insertion -
// which makes it a clunky, unintuitive way to just put two paragraphs or an
// image next to some text). This is a small custom node pair instead: a
// `columns` container holding exactly two independently-editable `column`
// children, following Tiptap's standard nested-node-view pattern. No custom
// NodeView/React component is needed since both render as plain content-hole
// divs - ProseMirror handles nested editable block content natively.
export const Column = Node.create({
  name: "column",
  content: "block+",
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "column" }), 0]
  },
})

export const Columns = Node.create({
  name: "columns",
  group: "block",
  content: "column column",
  isolating: true,

  parseHTML() {
    return [{ tag: 'div[data-type="columns"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "columns" }), 0]
  },

  addCommands() {
    return {
      setColumns:
        () =>
        ({ chain, state }) => {
          // insertContent alone leaves the cursor after the whole inserted
          // structure (i.e. in column 2's paragraph), not column 1's - not
          // what anyone typing right after inserting this would expect.
          // +2 lands inside the first (empty) paragraph - verified directly
          // against the resulting doc rather than assumed from ProseMirror's
          // general position-counting rules, which didn't quite match here.
          const from = state.selection.from
          return chain()
            .insertContent({
              type: this.name,
              content: [
                { type: "column", content: [{ type: "paragraph" }] },
                { type: "column", content: [{ type: "paragraph" }] },
              ],
            })
            .setTextSelection(from + 2)
            .run()
        },
    }
  },
})

export default Columns
