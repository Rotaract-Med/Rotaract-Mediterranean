"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/client"
import { Save, ImageIcon, Video, Upload } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AwardsSettingsFormProps {
  settings: any
  mediaFiles: any[]
}

export function AwardsSettingsForm({ settings, mediaFiles }: AwardsSettingsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [showMediaSelector, setShowMediaSelector] = useState(false)
  const [formData, setFormData] = useState({
    year: settings?.year || new Date().getFullYear().toString(),
    title: settings?.title || "The Outstanding Project Awards",
    background_image: settings?.background_image || "",
    hero_video_url: settings?.hero_video_url || "",
    hero_type: settings?.hero_type || "video",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("awards_settings")
        .update({
          year: formData.year,
          title: formData.title,
          background_image: formData.background_image,
          hero_video_url: formData.hero_video_url,
          hero_type: formData.hero_type,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id)

      if (error) throw error

      toast({
        title: "Settings saved!",
        description: "Awards page settings have been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const selectImage = (imageUrl: string) => {
    setFormData({ ...formData, background_image: imageUrl })
    setShowMediaSelector(false)
  }

  const selectVideo = (videoUrl: string) => {
    setFormData({ ...formData, hero_video_url: videoUrl })
    setShowMediaSelector(false)
  }

  // Filter media files by type
  const imageFiles = mediaFiles.filter(file => file.file_type.startsWith('image/'))
  const videoFiles = mediaFiles.filter(file => file.file_type.startsWith('video/'))

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Page Configuration</CardTitle>
          <CardDescription>These settings control the main hero section of the awards page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="2024"
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">The year displayed on the awards page</p>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Mediterranean Excellence Awards"
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">Main title displayed on the hero section</p>
          </div>

          <div>
            <Label>Hero Background</Label>
            <Tabs value={formData.hero_type} onValueChange={(value) => setFormData({ ...formData, hero_type: value as "image" | "video" })} className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="video">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </TabsTrigger>
                <TabsTrigger value="image">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Image
                </TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="space-y-3">
                {formData.hero_video_url && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 bg-black">
                    <video
                      src={formData.hero_video_url}
                      className="w-full h-full object-cover"
                      controls
                      muted
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMediaSelector(!showMediaSelector)}
                  className="w-full"
                >
                  <Video className="h-4 w-4 mr-2" />
                  {formData.hero_video_url ? "Change Video" : "Select Video from Library"}
                </Button>
                <div>
                  <Label htmlFor="hero_video_url" className="text-sm">Or enter Video URL</Label>
                  <Input
                    id="hero_video_url"
                    value={formData.hero_video_url}
                    onChange={(e) => setFormData({ ...formData, hero_video_url: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Direct URL to video file (.mp4 recommended)
                  </p>
                </div>
                {showMediaSelector && videoFiles.length > 0 && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-3">Select Video from Media Library</h3>
                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {videoFiles.map((file) => {
                        const videoUrl = file.s3_url || file.file_url
                        return (
                          <button
                            key={file.id}
                            type="button"
                            onClick={() => selectVideo(videoUrl)}
                            className="relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-[#193fa6] transition-all bg-black"
                          >
                            <video
                              src={videoUrl}
                              className="w-full h-full object-cover"
                              muted
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                              <p className="text-xs text-white truncate">{file.file_name}</p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                {showMediaSelector && videoFiles.length === 0 && (
                  <div className="border rounded-lg p-4 bg-gray-50 text-center">
                    <Video className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">No videos in media library</p>
                    <p className="text-xs text-gray-500 mt-1">Upload videos from the Media page</p>
                  </div>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> For best results, use a video that is:
                  </p>
                  <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                    <li>1920x1080 resolution (Full HD)</li>
                    <li>MP4 format with H.264 codec</li>
                    <li>10-30 seconds long (loops automatically)</li>
                    <li>Optimized for web (compressed file size)</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-3">
                {formData.background_image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={formData.background_image}
                      alt="Background preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMediaSelector(!showMediaSelector)}
                  className="w-full"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {formData.background_image ? "Change Image" : "Select Image"}
                </Button>
                <p className="text-sm text-gray-500">
                  Background image for the hero section (recommended: 1920x1080px)
                </p>
                {showMediaSelector && imageFiles.length > 0 && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold mb-3">Select from Media Library</h3>
                    <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                      {imageFiles.map((file) => {
                        const imageUrl = file.s3_url || file.base64_data || file.file_url
                        return (
                          <button
                            key={file.id}
                            type="button"
                            onClick={() => selectImage(imageUrl)}
                            className="relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-[#193fa6] transition-all"
                          >
                            <img
                              src={imageUrl}
                              alt={file.file_name}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                {showMediaSelector && imageFiles.length === 0 && (
                  <div className="border rounded-lg p-4 bg-gray-50 text-center">
                    <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">No images in media library</p>
                    <p className="text-xs text-gray-500 mt-1">Upload images from the Media page</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <Button type="submit" disabled={isSaving} className="w-full bg-[#193fa6] hover:bg-[#142f7a]">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
