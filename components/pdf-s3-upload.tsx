"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Upload, X, Loader2, ExternalLink } from "lucide-react"
import { uploadToS3 } from "@/lib/s3"

interface PDFS3UploadProps {
  onPDFUploaded: (pdfUrl: string, s3Key: string, fileName: string) => void
  currentPdfUrl?: string
}

export function PDFS3Upload({ onPDFUploaded, currentPdfUrl }: PDFS3UploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentPdfUrl || null)
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
    setIsUploading(true)

    try {
      // Convert File to Buffer for S3 upload
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Generate unique S3 key
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const key = `pdfs/${timestamp}-${sanitizedFileName}`
      
      // Upload directly to S3
      const result = await uploadToS3(buffer, key, "application/pdf")
      
      setUploadedUrl(result.url)
      onPDFUploaded(result.url, result.key, file.name)
    } catch (err: any) {
      setError(err.message || "Failed to upload PDF")
      setSelectedFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setUploadedUrl(null)
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
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
        id="pdf-s3-upload"
        aria-label="Upload PDF file to S3"
      />

      {!uploadedUrl ? (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragging ? "border-[#193fa6] bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 text-[#193fa6] mb-4 animate-spin" />
                <p className="text-sm font-medium text-gray-700 mb-1">Uploading PDF to S3...</p>
                <p className="text-xs text-gray-500">Please wait</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm font-medium text-gray-700 mb-1">Upload PDF Article</p>
                <p className="text-xs text-gray-500 mb-4">Drag and drop or click to browse</p>
                <Button type="button" variant="outline" size="sm">
                  Choose PDF File
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-[#193fa6]" />
                <div>
                  <p className="text-sm font-medium text-green-800">PDF uploaded successfully</p>
                  <p className="text-xs text-green-600">Stored in S3</p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Preview PDF
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
