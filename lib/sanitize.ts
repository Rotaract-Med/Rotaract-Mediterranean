import sanitizeHtml from "sanitize-html"

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

/**
 * Sanitizes article HTML before it reaches the DOM - both on the public
 * medtimes page and in the dashboard preview. Applied at render time (not
 * only on save) so it also cleans up rows written before this existed.
 *
 * Uses sanitize-html rather than (isomorphic-)dompurify: dompurify's
 * server-side path runs through jsdom, and jsdom's html-encoding-sniffer
 * dependency now pulls in the ESM-only @exodus/bytes package. Vercel's
 * Node runtime can't require() that (ERR_REQUIRE_ESM) regardless of
 * whether it's bundled or externalized - sanitize-html has no DOM-emulation
 * dependency at all, so this class of problem can't recur.
 */
export function sanitizeArticleHtml(html: string | null | undefined): string {
  if (!html) return ""
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { "*": ALLOWED_ATTR },
    // Raw passthrough, matching dompurify's prior behavior (which didn't
    // filter individual CSS properties either) - the editor's resize/color/
    // alignment features all rely on inline style attributes surviving as-is.
    parseStyleAttributes: false,
    // data: URIs only for <img> (inline PDF-import pages saved before this
    // session's S3-hosting fix still have base64 image src values), not for
    // <a href> - matches dompurify's default DATA_URI_TAGS scoping, which
    // never included anchors.
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    transformTags: {
      a: (tagName, attribs) => {
        if (attribs.target === "_blank") {
          attribs.rel = "noopener noreferrer"
        }
        return { tagName, attribs }
      },
    },
  })
}
