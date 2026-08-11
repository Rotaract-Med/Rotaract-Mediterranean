"use client"

import type React from "react"
import { useRef, useState } from "react"
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
import { CheckCircle2, FileText, Files, ImageIcon, Loader2, X, XCircle } from "lucide-react"

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB, matches direct-to-S3 upload
const MAX_FILES = 30
const CONCURRENCY = 3

type UploadStatus = "pending" | "uploading" | "success" | "error"

interface FileItem {
  id: string
  file: File
  status: UploadStatus
  progress: number
  error?: string
}

export function BulkMediaUploadDialog() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [items, setItems] = useState<FileItem[]>([])
  const [formError, setFormError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetState = () => {
    setItems([])
    setFormError(null)
    setIsUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    if (selected.length === 0) return

    const oversized = selected.filter((f) => f.size > MAX_FILE_SIZE)
    let validFiles = selected.filter((f) => f.size <= MAX_FILE_SIZE)

    const room = Math.max(MAX_FILES - items.length, 0)
    const truncated = validFiles.length > room
    validFiles = validFiles.slice(0, room)

    const messages: string[] = []
    if (oversized.length > 0) messages.push(`${oversized.length} file(s) skipped — max size is 100MB each.`)
    if (truncated) messages.push(`Only ${MAX_FILES} files allowed per batch — extra files were skipped.`)
    setFormError(messages.length > 0 ? messages.join(" ") : null)

    if (validFiles.length > 0) {
      setItems((prev) => [
        ...prev,
        ...validFiles.map((file) => ({
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
          file,
          status: "pending" as UploadStatus,
          progress: 0,
        })),
      ])
    }

    e.target.value = ""
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, patch: Partial<FileItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const uploadDirectlyToS3 = (file: File, id: string): Promise<{ url: string; key: string }> => {
    return new Promise((resolve, reject) => {
      fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      })
        .then(async (presignResponse) => {
          if (!presignResponse.ok) {
            const errorData = await presignResponse.json().catch(() => ({}))
            throw new Error(errorData.error || "Failed to get upload URL")
          }
          return presignResponse.json()
        })
        .then(({ presignedUrl, publicUrl, key }) => {
          const xhr = new XMLHttpRequest()

          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              updateItem(id, { progress: Math.round((e.loaded / e.total) * 100) })
            }
          })

          xhr.addEventListener("load", () => {
            if (xhr.status === 200 || xhr.status === 204) {
              resolve({ url: publicUrl, key })
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`))
            }
          })

          xhr.addEventListener("error", () => reject(new Error("Network error during upload")))
          xhr.open("PUT", presignedUrl)
          xhr.setRequestHeader("Content-Type", file.type)
          xhr.send(file)
        })
        .catch(reject)
    })
  }

  const uploadOne = async (item: FileItem, userId: string) => {
    updateItem(item.id, { status: "uploading", progress: 0, error: undefined })

    try {
      const { url, key } = await uploadDirectlyToS3(item.file, item.id)

      const supabase = createClient()
      const { error: dbError } = await supabase.from("media_library").insert({
        file_name: item.file.name,
        file_url: url,
        file_type: item.file.type,
        alt_text: null,
        s3_key: key,
        s3_url: url,
        file_size: item.file.size,
        uploaded_by: userId,
      })

      if (dbError) throw new Error("Failed to save file metadata")

      updateItem(item.id, { status: "success", progress: 100 })
    } catch (err: any) {
      updateItem(item.id, { status: "error", error: err.message || "Upload failed" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const targets = items.filter((item) => item.status === "pending" || item.status === "error")
    if (targets.length === 0) {
      setFormError("Please select at least one file to upload")
      return
    }

    setFormError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setFormError("You must be logged in to upload files")
      return
    }

    setIsUploading(true)

    const queue = [...targets]
    const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      while (queue.length > 0) {
        const next = queue.shift()
        if (!next) break
        await uploadOne(next, user.id)
      }
    })

    await Promise.all(workers)

    setIsUploading(false)
    router.refresh()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (isUploading) return
      resetState()
    }
    setIsOpen(open)
  }

  const successCount = items.filter((i) => i.status === "success").length
  const errorCount = items.filter((i) => i.status === "error").length
  const retryableCount = items.filter((i) => i.status === "pending" || i.status === "error").length
  const allDone = items.length > 0 && successCount === items.length

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Files className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Bulk Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Bulk Upload</DialogTitle>
          <DialogDescription>
            Upload multiple images, videos, or documents at once. Max 100MB per file, {MAX_FILES} files per batch.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
          <div className="grid gap-2">
            <Label htmlFor="bulk-files">Select Files</Label>
            <Input
              id="bulk-files"
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,application/pdf"
              onChange={handleFilesChange}
              disabled={isUploading}
            />
          </div>

          {items.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Files ({items.length})</Label>
                {(successCount > 0 || errorCount > 0) && (
                  <span className="text-xs text-gray-500">
                    {successCount} uploaded{errorCount > 0 ? `, ${errorCount} failed` : ""}
                  </span>
                )}
              </div>
              <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 p-2">
                    {item.file.type.startsWith("image/") ? (
                      <ImageIcon className="h-4 w-4 shrink-0 text-gray-400" />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm truncate">{item.file.name}</p>
                      {item.status === "uploading" && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-[#193fa6] h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                      {item.status === "error" && <p className="text-xs text-red-500 truncate">{item.error}</p>}
                      {item.status === "pending" && (
                        <p className="text-xs text-gray-400">{(item.file.size / 1024 / 1024).toFixed(2)}MB</p>
                      )}
                    </div>
                    {item.status === "success" && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />}
                    {item.status === "error" && <XCircle className="h-4 w-4 shrink-0 text-red-500" />}
                    {item.status === "uploading" && (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-400" />
                    )}
                    {item.status === "pending" && !isUploading && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {formError && <p className="text-sm text-red-500">{formError}</p>}

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              disabled={isUploading || retryableCount === 0}
              className="bg-[#193fa6] hover:bg-[#2563eb]"
            >
              {isUploading
                ? `Uploading ${successCount + errorCount}/${items.length}...`
                : errorCount > 0
                  ? "Retry Failed"
                  : "Upload All"}
            </Button>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isUploading}>
              {allDone ? "Close" : "Cancel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
