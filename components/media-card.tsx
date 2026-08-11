"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Edit, Trash2, FileText, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaCardProps {
  file: any
  selectable?: boolean
  selected?: boolean
  onToggleSelect?: (id: string) => void
}

export function MediaCard({ file, selectable, selected, onToggleSelect }: MediaCardProps) {
  const router = useRouter()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [altText, setAltText] = useState(file.alt_text || "")
  const [fileName, setFileName] = useState(file.file_name || "")

  const isImage = file.file_type.startsWith("image/")
  const isVideo = file.file_type.startsWith("video/")
  // Prioritize S3 URL, fallback to base64
  const mediaSource = file.s3_url || file.base64_data || file.file_url

  // Debug logging
  console.log("MediaCard file:", {
    id: file.id,
    file_name: file.file_name,
    s3_url: file.s3_url,
    s3_key: file.s3_key,
    has_base64: !!file.base64_data,
    mediaSource: mediaSource?.substring(0, 100),
  })

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(mediaSource)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleUpdate = async () => {
    const supabase = createClient()
    try {
      const { error } = await supabase
        .from("media_library")
        .update({ alt_text: altText, file_name: fileName })
        .eq("id", file.id)

      if (error) throw error
      setIsEditOpen(false)
      router.refresh()
    } catch (err) {
      console.error("Error updating media:", err)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/media/${file.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Delete failed")
      }

      router.refresh()
    } catch (err) {
      console.error("Error deleting media:", err)
      alert(`Failed to delete: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-lg transition-shadow",
        selectable && "cursor-pointer",
        selected && "ring-2 ring-[#193fa6]"
      )}
      onClick={selectable ? () => onToggleSelect?.(file.id) : undefined}
    >
      <CardContent className="p-0">
        {isImage ? (
          <div className="aspect-video bg-gray-100 relative">
            <img
              src={mediaSource}
              alt={file.alt_text || file.file_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
            {selectable && (
              <div className="absolute top-2 left-2 bg-white/90 rounded p-0.5">
                <Checkbox checked={!!selected} className="pointer-events-none" />
              </div>
            )}
          </div>
        ) : isVideo ? (
          <div className="aspect-video bg-black relative">
            <video
              src={mediaSource}
              controls
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
            {selectable && (
              <div className="absolute top-2 left-2 bg-white/90 rounded p-0.5">
                <Checkbox checked={!!selected} className="pointer-events-none" />
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
            <FileText className="h-12 w-12 text-gray-400" />
            {selectable && (
              <div className="absolute top-2 left-2 bg-white/90 rounded p-0.5">
                <Checkbox checked={!!selected} className="pointer-events-none" />
              </div>
            )}
          </div>
        )}
        <div className="p-4 space-y-3">
          <div>
            <p className="font-medium text-sm text-gray-900 truncate">{file.file_name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {file.profiles?.full_name || "Unknown"} •{" "}
              {new Date(file.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
          </div>
          {!selectable && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyUrl} className="flex-1 bg-transparent">
              {isCopied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              {isCopied ? "Copied!" : "Copy"}
            </Button>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Edit className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Media</DialogTitle>
                  <DialogDescription>Update file information</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit_file_name">File Name</Label>
                    <Input
                      id="edit_file_name"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="My Image"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit_alt_text">Alt Text</Label>
                    <Input
                      id="edit_alt_text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={handleUpdate} className="bg-[#193fa6] hover:bg-[#2563eb]">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the file.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
