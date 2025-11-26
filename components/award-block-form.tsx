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
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import MediaSelector from "./media-selector"

interface AwardBlockFormProps {
  block?: any
}

export function AwardBlockForm({ block }: AwardBlockFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    block_type: block?.block_type || "hero",
    title: block?.title || "",
    subtitle: block?.subtitle || "",
    content: block?.content || "",
    image_data: block?.image_data || "",
    metadata: block?.metadata || {},
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    try {
      if (block) {
        await supabase.from("awards_page_blocks").update(formData).eq("id", block.id)
      } else {
        const { data: maxOrder } = await supabase
          .from("awards_page_blocks")
          .select("display_order")
          .order("display_order", { ascending: false })
          .limit(1)
          .single()

        await supabase.from("awards_page_blocks").insert({
          ...formData,
          display_order: (maxOrder?.display_order || 0) + 1,
        })
      }

      router.push("/dashboard/awards")
      router.refresh()
    } catch (error) {
      console.error("Error saving block:", error)
      alert("Failed to save block")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div>
            <Label htmlFor="block_type">Block Type</Label>
            <select
              id="block_type"
              value={formData.block_type}
              onChange={(e) => setFormData({ ...formData, block_type: e.target.value })}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#193fa6] focus:border-transparent"
              required
            >
              <option value="hero">Hero Section</option>
              <option value="award_card">Award Card</option>
              <option value="text_section">Text Section</option>
              <option value="image_gallery">Image Gallery</option>
              <option value="stats">Statistics</option>
              <option value="timeline">Timeline</option>
            </select>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter block title"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Enter subtitle (optional)"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter content text"
              rows={6}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Image</Label>
            <MediaSelector
              value={formData.image_data}
              onChange={(value) => setFormData({ ...formData, image_data: value })}
              filterType="image/%"
            />
            <p className="text-sm text-gray-500 mt-2">Recommended: 1920x1080px for hero, 800x800px for cards</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="bg-[#193fa6] hover:bg-[#142f7a]">
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : block ? "Update Block" : "Create Block"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/awards">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
