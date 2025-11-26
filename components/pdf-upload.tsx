"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Upload, X, Loader2 } from "lucide-react"
import { parsePDF, type PDFContent } from "@/lib/pdf-parser"

interface PDFUploadProps {
  onContentExtracted: (content: PDFContent) => void
}

export function PDFUpload({ onContentExtracted }: PDFUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const pdfFile = files.find((file) => file.type === "application/pdf")

    if (pdfFile) {
      await processFile(pdfFile)
    } else {
      setError("Please upload a PDF file")
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  const processFile = async (file: File) => {
    setError(null)
    setSelectedFile(file)
    setIsProcessing(true)

    try {
      const content = await parsePDF(file)
      onContentExtracted(content)
    } catch (err: any) {
      setError(err.message || "Failed to process PDF")
      setSelectedFile(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
        id="pdf-upload"
        aria-label="Upload PDF file"
      />

      {!selectedFile ? (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragging ? "border-[#193fa6] bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm font-medium text-gray-700 mb-1">Upload a PDF file</p>
            <p className="text-xs text-gray-500 mb-4">Drag and drop or click to browse</p>
            <Button type="button" variant="outline" size="sm">
              Choose File
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-[#193fa6]" />
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin text-[#193fa6]" />
            ) : (
              <Button type="button" variant="ghost" size="sm" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {isProcessing && (
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Processing PDF pages...</p>
          <p className="text-xs text-gray-500">Rendering full layout, images, colors, and formatting</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
