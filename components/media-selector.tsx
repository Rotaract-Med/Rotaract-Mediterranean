"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ImageIcon, Check } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MediaSelectorProps {
  value?: string
  onChange: (value: string) => void
  filterType?: string
}

export function MediaSelector({ value, onChange, filterType }: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<any[]>([])
  const [selectedImage, setSelectedImage] = useState<string | undefined>(value)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadMedia()
    }
  }, [isOpen])

  const loadMedia = async () => {
    setIsLoading(true)
    console.log("[v0] MediaSelector: Loading media files...")

    const supabase = createClient()

    const { data, error } = await supabase.from("media_library").select("*").order("created_at", { ascending: false })

    console.log("[v0] MediaSelector: Query result:", { data, error, count: data?.length })

    if (error) {
      console.error("[v0] MediaSelector: Error fetching media:", error)
    }

    if (data) {
      let filteredFiles = data
      if (filterType === "image") {
        filteredFiles = data.filter((file) => file.file_type?.startsWith("image/"))
        console.log("[v0] MediaSelector: Filtered image files:", filteredFiles.length)
      } else if (filterType === "video") {
        filteredFiles = data.filter((file) => file.file_type?.startsWith("video/"))
        console.log("[v0] MediaSelector: Filtered video files:", filteredFiles.length)
      } else if (filterType === "pdf") {
        filteredFiles = data.filter((file) => file.file_type === "application/pdf" || file.file_name?.endsWith(".pdf"))
        console.log("[v0] MediaSelector: Filtered PDF files:", filteredFiles.length)
      }
      setMediaFiles(filteredFiles)
    }

    setIsLoading(false)
  }

  const handleSelect = (imageData: string) => {
    console.log("[v0] MediaSelector: Selected image data length:", imageData?.length)
    setSelectedImage(imageData)
    onChange(imageData)
    setIsOpen(false)
  }

  return (
    <div className="space-y-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="w-full bg-transparent">
            <ImageIcon className="h-4 w-4 mr-2" />
            {value ? (filterType === "pdf" ? "Change PDF" : filterType === "video" ? "Change Video" : "Change Image") : "Select from Library"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select {filterType === "pdf" ? "PDF" : filterType === "video" ? "Video" : "Image"} from Media Library</DialogTitle>
            <DialogDescription>Choose {filterType === "pdf" ? "a PDF document" : filterType === "video" ? "a video" : "an image"} from your uploaded media</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Loading images...</p>
              </div>
            ) : mediaFiles.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {mediaFiles.map((file) => {
                  const imageSource = file.s3_url || file.base64_data || file.file_url
                  const isSelected = selectedImage === imageSource
                  return (
                    <Card
                      key={file.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        isSelected ? "ring-2 ring-[#193fa6]" : ""
                      }`}
                      onClick={() => handleSelect(imageSource)}
                    >
                      <CardContent className="p-2">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                          {file.file_type?.startsWith("video/") ? (
                            <video
                              src={imageSource || "/placeholder.svg"}
                              className="w-full h-full object-cover"
                              muted
                            />
                          ) : (
                            <img
                              src={imageSource || "/placeholder.svg"}
                              alt={file.alt_text || file.file_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error("[v0] MediaSelector: Image load error for:", file.file_name)
                                e.currentTarget.src = "/placeholder.svg"
                              }}
                            />
                          )}
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#193fa6]/20 flex items-center justify-center">
                              <div className="bg-[#193fa6] rounded-full p-2">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-2 truncate">{file.file_name}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">No {filterType === "pdf" ? "PDFs" : filterType === "video" ? "videos" : "images"} in library</p>
                <p className="text-sm text-gray-400 mt-1">Upload {filterType === "pdf" ? "PDF files" : filterType === "video" ? "videos" : "images"} to the media library first</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      {value && (
        <div className="border rounded-lg p-2 bg-gray-50">
          {filterType === "pdf" ? (
            <div className="flex items-center gap-2 p-2">
              <ImageIcon className="h-8 w-8 text-blue-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">PDF Selected</p>
                <p className="text-xs text-gray-500 truncate">{value}</p>
              </div>
            </div>
          ) : filterType === "video" ? (
            <video
              src={value}
              className="w-full h-32 object-cover rounded-lg mx-auto"
              controls
              muted
            />
          ) : (
            <img
              src={value || "/placeholder.svg"}
              alt="Selected image"
              className="w-32 h-32 object-cover rounded-lg mx-auto"
            />
          )}
        </div>
      )}
    </div>
  )
}

export default MediaSelector
