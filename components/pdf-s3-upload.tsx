"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Upload, X, Loader2, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/client"

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
  const [uploadProgress, setUploadProgress] = useState(0)
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

  const uploadDirectlyToS3 = async (file: File): Promise<{ url: string; key: string }> => {
    // Get presigned URL from backend
    const presignResponse = await fetch("/api/upload/presigned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    })

    if (!presignResponse.ok) {
      const errorData = await presignResponse.json()
      throw new Error(errorData.error || "Failed to get upload URL")
    }

    const { presignedUrl, publicUrl, key } = await presignResponse.json()

    // Upload directly to S3 using presigned URL with progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          setUploadProgress(Math.round(percentComplete))
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 204) {
          resolve({ url: publicUrl, key })
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'))
      })

      xhr.open('PUT', presignedUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })
  }

  const processFile = async (file: File) => {
    setError(null)
    setSelectedFile(file)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Check file size (allow up to 100MB for direct upload)
      const maxSize = 100 * 1024 * 1024 // 100MB
      const smallFileLimit = 3 * 1024 * 1024 // 3MB

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to upload files")
      }

      let url: string
      let key: string

      // Use direct S3 upload for files larger than 3MB
      if (file.size > smallFileLimit) {
        if (file.size > maxSize) {
          throw new Error(`File size too large. Maximum size is 100MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        }

        // Direct upload for large files
        const result = await uploadDirectlyToS3(file)
        url = result.url
        key = result.key

        // Save metadata to database
        const { error: dbError } = await supabase
          .from("media_library")
          .insert({
            file_name: file.name,
            file_url: url,
            file_type: file.type,
            alt_text: null,
            s3_key: key,
            s3_url: url,
            file_size: file.size,
            uploaded_by: user.id,
          })

        if (dbError) {
          console.error("Database error:", dbError)
          throw new Error("Failed to save file metadata")
        }
      } else {
        // Convert File to base64 data URI for small files
        const reader = new FileReader()
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        
        const dataURI = await base64Promise
        
        // Upload via API route for small files
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: dataURI,
            fileName: file.name,
            title: file.name,
            fileType: "application/pdf",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to upload PDF")
        }

        const result = await response.json()
        url = result.url
        key = result.file.s3_key
      }
      
      setUploadedUrl(url)
      onPDFUploaded(url, key, file.name)
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || "Failed to upload PDF")
      setSelectedFile(null)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
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
                {uploadProgress > 0 && (
                  <div className="w-full max-w-xs mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#193fa6] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">Please wait</p>
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
