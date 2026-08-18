// Load PDF.js from CDN instead of npm package to avoid webpack issues
const loadPdfJs = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("PDF parsing is only available in the browser"))
      return
    }

    // Check if already loaded
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib)
      return
    }

    // Load from CDN
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
    script.async = true
    
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib
      if (pdfjsLib) {
        // Set worker source
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
        resolve(pdfjsLib)
      } else {
        reject(new Error("Failed to load PDF.js library"))
      }
    }
    
    script.onerror = () => {
      reject(new Error("Failed to load PDF.js from CDN"))
    }
    
    document.head.appendChild(script)
  })
}

export interface PDFContent {
  text: string
  title: string
  excerpt: string
  htmlContent: string
  pageImages: string[] // Hosted S3 URLs of each rendered PDF page
}

function canvasToFile(canvas: HTMLCanvasElement, name: string): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to encode PDF page as an image"))
          return
        }
        resolve(new File([blob], name, { type: "image/png" }))
      },
      "image/png",
      0.95,
    )
  })
}

// Uploads a rendered PDF page straight to S3 via the presigned-URL endpoint
// and nothing else - deliberately skipping components/editor/image-upload.ts's
// uploadEditorImage(), which additionally records an entry in media_library.
// These page renders are a mechanical by-product of importing a PDF, not
// something an author is choosing to add to the shared media library, and
// media_team browses that table directly - one row per page (times however
// many times a journalist re-imports while getting the article right) would
// clutter their view with images nobody meant to curate. Skipping the DB
// record just means the file only lives at its S3 URL; the URL is stable
// either way, which is all the article content needs.
async function uploadPdfPageImage(file: File): Promise<string> {
  const presignResponse = await fetch("/api/upload/presigned", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileType: file.type }),
  })

  if (!presignResponse.ok) {
    const errorData = await presignResponse.json()
    throw new Error(errorData.error || "Failed to get upload URL for PDF page")
  }

  const { presignedUrl, publicUrl } = await presignResponse.json()

  const putResponse = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  })

  if (!putResponse.ok) {
    throw new Error(`Failed to upload PDF page image (status ${putResponse.status})`)
  }

  return publicUrl
}

/**
 * Extract full PDF content including layout, images, colors, and formatting
 * Renders each page as a high-quality image to preserve visual fidelity.
 *
 * Each rendered page is uploaded to S3 (same path as any other editor image,
 * see components/editor/image-upload.ts) rather than inlined as a base64
 * data URI - a multi-page PDF at 2x render scale can easily produce tens of
 * MB of inline base64, which blows past localStorage's draft-snapshot quota
 * and Supabase's request size limits, making saves fail silently.
 */
export async function parsePDF(file: File, onPageProgress?: (page: number, total: number) => void): Promise<PDFContent> {
  try {
    // Get pdfjs library (client-side only)
    const pdfjs = await loadPdfJs()
    
    const arrayBuffer = await file.arrayBuffer()
    
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise

    let fullText = ""
    let firstParagraph = ""
    const htmlParts: string[] = []
    const pageImages: string[] = []

    // Process each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)

      // Render page to canvas for full visual fidelity
      const viewport = page.getViewport({ scale: 2.0 }) // 2x scale for better quality
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      if (!context) {
        throw new Error("Failed to get canvas context")
      }

      canvas.width = viewport.width
      canvas.height = viewport.height

      // Render PDF page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      }).promise

      // Upload the rendered page and use its hosted URL, rather than
      // embedding the (often multi-MB) image inline as base64
      const pageFile = await canvasToFile(canvas, `${file.name.replace(/\.pdf$/i, "")}-page-${pageNum}.png`)
      const pageUrl = await uploadPdfPageImage(pageFile)
      pageImages.push(pageUrl)
      onPageProgress?.(pageNum, pdf.numPages)

      // Also extract text for searchability and metadata
      const textContent = await page.getTextContent()

      // Group text items by their Y position to detect lines
      const lines: Map<number, string[]> = new Map()

      for (const item of textContent.items) {
        if ("str" in item && item.str.trim()) {
          // Round Y position to group nearby items
          const y = Math.round(item.transform[5])
          if (!lines.has(y)) {
            lines.set(y, [])
          }
          lines.get(y)!.push(item.str)
        }
      }

      // Sort lines by Y position (top to bottom)
      const sortedLines = Array.from(lines.entries()).sort((a, b) => b[0] - a[0])

      // Process each line for text extraction
      for (const [, textItems] of sortedLines) {
        const lineText = textItems.join(" ").trim()
        if (lineText) {
          fullText += lineText + "\n"

          // Capture first substantial paragraph for excerpt
          if (!firstParagraph && lineText.length > 50) {
            firstParagraph = lineText.substring(0, 200)
          }
        }
      }
    }

    // Build HTML content with rendered page images
    for (let i = 0; i < pageImages.length; i++) {
      htmlParts.push(`<img src="${pageImages[i]}" alt="Page ${i + 1}" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 20px auto;" />`)
      
      // Add page separator for multi-page documents. Uses <hr> (a real node
      // in the editor's schema) rather than a bare styled <div>, which isn't
      // a recognized node type and gets silently dropped when parsed into
      // the editor - not what we want for a visible page divider.
      if (i < pageImages.length - 1) {
        htmlParts.push(`<hr />`)
      }
    }

    // Generate title from first line or filename
    const lines = fullText.split("\n").filter((line) => line.trim())
    const title = lines[0]?.substring(0, 100) || file.name.replace(".pdf", "")

    // Generate excerpt
    const excerpt = firstParagraph || (lines[1] || lines[0] || "").substring(0, 200)

    return {
      text: fullText,
      title: title,
      excerpt: excerpt + (excerpt.length === 200 ? "..." : ""),
      htmlContent: htmlParts.join("\n"),
      pageImages: pageImages,
    }
  } catch (error: any) {
    console.error("Error parsing PDF:", error)
    
    // Provide more specific error messages
    if (error?.message?.includes("Invalid PDF")) {
      throw new Error("Invalid or corrupted PDF file. Please try a different file.")
    } else if (error?.message?.includes("password")) {
      throw new Error("Password-protected PDFs are not supported.")
    } else if (error?.message?.includes("worker")) {
      throw new Error("PDF worker failed to load. Please check your internet connection and try again.")
    } else {
      throw new Error(`Failed to parse PDF: ${error?.message || "Unknown error"}`)
    }
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}
