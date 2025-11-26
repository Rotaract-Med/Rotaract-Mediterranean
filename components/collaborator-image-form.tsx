"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save } from "lucide-react"
import { MediaSelector } from "@/components/media-selector"

interface CollaboratorImageFormProps {
  collaborator?: any
}

export function CollaboratorImageForm({ collaborator }: CollaboratorImageFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    image_url: collaborator?.image_url || "",
    alt_text: collaborator?.alt_text || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (collaborator) {
        const { error } = await supabase
          .from("collaborator_images")
          .update(formData)
          .eq("id", collaborator.id)
        if (error) throw error
      } else {
        // Get the current max display_order and add 1
        const { data: existingImages } = await supabase
          .from("collaborator_images")
          .select("display_order")
          .order("display_order", { ascending: false })
          .limit(1)
        
        const nextOrder = existingImages && existingImages.length > 0 
          ? (existingImages[0].display_order || 0) + 1 
          : 0

        const { error } = await supabase
          .from("collaborator_images")
          .insert([{ ...formData, display_order: nextOrder }])
        if (error) throw error
      }

      router.push("/dashboard/team")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Image Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="image_url">Image</Label>
              <MediaSelector
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
              />
              <p className="text-sm text-gray-500">Select an image from the media library</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="alt_text">Alt Text (Optional)</Label>
              <Input
                id="alt_text"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                placeholder="Description of the collaborator"
              />
              <p className="text-sm text-gray-500">Brief description for accessibility</p>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/team")} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#193fa6] hover:bg-[#2563eb]" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : collaborator ? "Update Image" : "Add Image"}
          </Button>
        </div>
      </div>
    </form>
  )
}
