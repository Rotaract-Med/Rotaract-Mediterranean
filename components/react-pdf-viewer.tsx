"use client"

import { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

// Configure PDF.js worker
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString()
}

interface ReactPDFViewerProps {
  pdfUrl: string
  title?: string
}

export function ReactPDFViewer({ pdfUrl, title }: ReactPDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState(true)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setLoading(false)
  }

  function onDocumentLoadError(error: Error) {
    console.error("Error loading PDF:", error)
    setLoading(false)
  }

  return (
    <div className="w-full">
      {loading && (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#193fa6]"></div>
          <span className="ml-3 text-gray-600">Loading PDF...</span>
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#193fa6]"></div>
            </div>
          }
          className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg"
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="max-w-full"
            width={Math.min(window.innerWidth - 100, 900)}
          />
        </Document>

        {numPages > 0 && (
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-lg shadow-md">
            <Button
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm font-medium text-gray-700">
              Page {pageNumber} of {numPages}
            </span>

            <Button
              onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
              disabled={pageNumber >= numPages}
              variant="outline"
              size="sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
