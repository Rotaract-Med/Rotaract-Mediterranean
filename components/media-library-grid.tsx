"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { MediaCard } from "@/components/media-card"
import { FileText, ImageIcon, ListChecks, Trash2, X } from "lucide-react"

interface MediaLibraryGridProps {
  imageFiles: any[]
  documentFiles: any[]
  canDelete: boolean
}

export function MediaLibraryGrid({ imageFiles, documentFiles, canDelete }: MediaLibraryGridProps) {
  const router = useRouter()
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allFiles = [...imageFiles, ...documentFiles]

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const exitSelectionMode = () => {
    setSelectionMode(false)
    setSelectedIds(new Set())
    setError(null)
  }

  const selectAll = () => {
    setSelectedIds(new Set(allFiles.map((f) => f.id)))
  }

  const handleBulkDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch("/api/media/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Delete failed")
      }

      setSelectionMode(false)
      setSelectedIds(new Set())
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to delete selected files")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {canDelete && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {selectionMode ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">{selectedIds.size} selected</span>
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>
                Clear
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={selectedIds.size === 0 || isDeleting}
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete Selected
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {selectedIds.size} file(s)?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the selected files.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBulkDelete}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="ghost" size="sm" onClick={exitSelectionMode} disabled={isDeleting}>
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setSelectionMode(true)} disabled={allFiles.length === 0}>
              <ListChecks className="h-3.5 w-3.5 mr-1" />
              Select
            </Button>
          )}
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Images Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Images</h2>
          <Badge variant="secondary">{imageFiles.length} files</Badge>
        </div>
        {imageFiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {imageFiles.map((file) => (
              <MediaCard
                key={file.id}
                file={file}
                selectable={selectionMode}
                selected={selectedIds.has(file.id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No images uploaded yet</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Documents</h2>
          <Badge variant="secondary">{documentFiles.length} files</Badge>
        </div>
        {documentFiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentFiles.map((file) => (
              <MediaCard
                key={file.id}
                file={file}
                selectable={selectionMode}
                selected={selectedIds.has(file.id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No documents uploaded yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
