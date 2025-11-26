"use client"

import { useEffect, useRef, useState } from "react"

interface NutrientPDFViewerProps {
  pdfUrl: string
  title?: string
}

export function NutrientPDFViewer({ pdfUrl, title }: NutrientPDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let instance: any = null
    let PSPDFKit: any = null

    const loadNutrient = async () => {
      try {
        setLoading(true)
        setError(null)
        
        PSPDFKit = (await import("@nutrient-sdk/viewer")).default

        instance = await PSPDFKit.load({
          container,
          document: pdfUrl,
          baseUrl: `${window.location.protocol}//${window.location.host}/nutrient-viewer-lib/`,
        })
        
        setLoading(false)
      } catch (error: any) {
        console.error("Failed to load Nutrient PDF Viewer:", error)
        setError(error.message || "Failed to load PDF viewer")
        setLoading(false)
      }
    }

    loadNutrient()

    return () => {
      if (instance && PSPDFKit) {
        PSPDFKit.unload(instance)
      }
    }
  }, [pdfUrl])

  if (error) {
    return (
      <div className="w-full">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <p className="text-sm text-yellow-800">Advanced PDF viewer failed to load. Using fallback viewer.</p>
        </div>
        <div className="w-full border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
          <iframe
            src={pdfUrl}
            className="w-full"
            style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}
            title={title}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {loading && (
        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#193fa6]"></div>
          <span className="ml-3 text-gray-600">Loading PDF viewer...</span>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg"
        style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}
      />
    </div>
  )
}
