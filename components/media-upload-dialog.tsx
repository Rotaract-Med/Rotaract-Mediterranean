"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload } from "lucide-react"

export function MediaUploadDialog() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")
  const [altText, setAltText] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [base64Data, setBase64Data] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string>("")
  const [fileSize, setFileSize] = useState<number>(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Set file metadata
    setFileName(file.name)
    setFileType(file.type)
    setFileSize(file.size)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setBase64Data(result)
      setPreviewUrl(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!base64Data) {
      setError("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Upload to S3 via API
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: base64Data,
          fileName: fileName,
          title: fileName,
          description: altText,
          fileType: fileType,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const result = await response.json()
      console.log("Upload successful:", result)

      // Reset form
      setIsOpen(false)
      setFileName("")
      setAltText("")
      setPreviewUrl(null)
      setBase64Data(null)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#193fa6] hover:bg-[#2563eb]" size="sm">
          <Upload className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Upload Media</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>Add a new image or document to your media library</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Select File</Label>
            <Input id="file" type="file" accept="image/*,video/*" onChange={handleFileChange} required />
            <p className="text-xs text-gray-500">Supports images and videos. Recommended: max 50MB</p>
          </div>

          {previewUrl && (
            <div className="grid gap-2">
              <Label>Preview</Label>
              <div className="border rounded-lg p-2 bg-gray-50">
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-contain" />
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="file_name">File Name</Label>
            <Input
              id="file_name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="My Image"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alt_text">Alt Text (for images)</Label>
            <Input
              id="alt_text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Description of the image"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isUploading} className="bg-[#193fa6] hover:bg-[#2563eb]">
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
