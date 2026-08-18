import DOMPurify from "isomorphic-dompurify"

// Matches what the Tiptap toolbar (components/editor/editor-toolbar.tsx) can
// actually produce. No iframe/script - embeds aren't offered in the editor,
// so there's no legitimate reason to allow them through on render.
const ALLOWED_TAGS = [
  "p", "br", "hr",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "strong", "b", "em", "i", "u", "s", "strike", "code", "pre",
  "blockquote",
  "ul", "ol", "li",
  "a", "img",
  "table", "thead", "tbody", "tr", "th", "td", "colgroup", "col",
  "div", "span",
]

const ALLOWED_ATTR = [
  "href", "target", "rel",
  "src", "alt", "title", "width", "height",
  "class", "style",
  "colspan", "rowspan", "align",
]

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer")
  }
})

/**
 * Sanitizes article HTML before it reaches the DOM - both on the public
 * medtimes page and in the dashboard preview. Applied at render time (not
 * only on save) so it also cleans up rows written before this existed.
 */
export function sanitizeArticleHtml(html: string | null | undefined): string {
  if (!html) return ""
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
}
