"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Video } from "lucide-react"
import MediaSelector from "./media-selector"

interface HeroSlideFormProps {
  slide?: any
}

export default function HeroSlideForm({ slide }: HeroSlideFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: slide?.title || "",
    subtitle: slide?.subtitle || "",
    image_data: slide?.image_data || "",
    media_type: slide?.media_type || "image",
    media_url: slide?.media_url || "",
    display_order: slide?.display_order || 0,
    is_active: slide?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Not authenticated")
      }

      const slideData = {
        ...formData,
        created_by: user.id,
        updated_at: new Date().toISOString(),
      }

      if (slide) {
        const { error: updateError } = await supabase.from("hero_slides").update(slideData).eq("id", slide.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("hero_slides").insert([slideData])

        if (insertError) throw insertError
      }

      router.push("/dashboard/hero-slides")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Welcome"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle *</Label>
            <Textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Discover the biggest hub connecting Europe, Middle East & Africa..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Slide Media *</Label>
            <Tabs 
              value={formData.media_type} 
              onValueChange={(value) => setFormData({ ...formData, media_type: value as "image" | "video" })}
              className="mt-2"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="image">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="video">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="space-y-3">
                <MediaSelector
                  value={formData.image_data}
                  onChange={(imageData) => setFormData({ ...formData, image_data: imageData, media_url: imageData })}
                  filterType="image"
                />
                <p className="text-sm text-gray-500">Recommended size: 1920x1080px (16:9 aspect ratio)</p>
              </TabsContent>

              <TabsContent value="video" className="space-y-3">
                <MediaSelector
                  value={formData.media_url}
                  onChange={(videoUrl) => setFormData({ ...formData, media_url: videoUrl })}
                  filterType="video"
                />
                <div className="space-y-2">
                  <Label htmlFor="video_url" className="text-sm">Or enter Video URL</Label>
                  <Input
                    id="video_url"
                    value={formData.media_url}
                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                  />
                  <p className="text-xs text-gray-500">Direct URL to video file (.mp4 recommended)</p>
                </div>
                {formData.media_url && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200 bg-black">
                    <video
                      src={formData.media_url}
                      className="w-full h-full object-cover"
                      controls
                      muted
                    />
                  </div>
                )}
                <p className="text-sm text-gray-500">Recommended: 1920x1080px, MP4 format, 10-30 seconds</p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
              min="0"
            />
            <p className="text-sm text-gray-500">Lower numbers appear first in the carousel</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active (visible on homepage)</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="bg-[#193fa6] hover:bg-[#142f7a]">
              {loading ? "Saving..." : slide ? "Update Slide" : "Create Slide"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
