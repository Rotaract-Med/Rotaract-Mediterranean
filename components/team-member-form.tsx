"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"
import { MediaSelector } from "@/components/media-selector"

interface TeamMemberFormProps {
  member?: any
}

export function TeamMemberForm({ member }: TeamMemberFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: member?.full_name || "",
    position: member?.position || "",
    section: member?.section || "executive_board",
    bio: member?.bio || "",
    avatar_url: member?.avatar_url || "",
    country: member?.country || "",
    email: member?.email || "",
    linkedin_url: member?.linkedin_url || "",
    instagram_url: member?.instagram_url || "",
    display_order: member?.display_order || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (member) {
        const { error } = await supabase.from("team_members").update(formData).eq("id", member.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("team_members").insert([formData])
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
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="President, Secretary, etc."
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="section">Section</Label>
              <Select value={formData.section} onValueChange={(value) => setFormData({ ...formData, section: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive_board">Executive Board</SelectItem>
                  <SelectItem value="country_representatives">Country Representatives</SelectItem>
                  <SelectItem value="collaborators">Collaborators</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">
                {formData.section === 'collaborators' 
                  ? 'Use the Collaborators section below to manage images for the home page' 
                  : 'Select the section this member belongs to'}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Greece, Italy, etc."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief biography"
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact & Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input
                id="instagram_url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                placeholder="https://instagram.com/username"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatar_url">Avatar Image</Label>
              <MediaSelector
                value={formData.avatar_url}
                onChange={(value) => setFormData({ ...formData, avatar_url: value })}
              />
              <p className="text-xs text-gray-500">
                Recommended size: 400x400px (square) for best display on team page
              </p>
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading} className="bg-[#193fa6] hover:bg-[#2563eb]">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Member"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}
