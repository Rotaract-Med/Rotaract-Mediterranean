"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

interface MedshopSettings {
  id: string
  mode: "coming_soon" | "redirect"
  redirect_url: string | null
}

interface MedshopSettingsFormProps {
  settings: MedshopSettings
}

export function MedshopSettingsForm({ settings }: MedshopSettingsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [mode, setMode] = useState<"coming_soon" | "redirect">(settings.mode)
  const [redirectUrl, setRedirectUrl] = useState(settings.redirect_url || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === "redirect" && !redirectUrl.trim()) {
      toast({
        title: "URL required",
        description: "Enter the URL to send visitors to, or switch back to Coming Soon.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("medshop_settings")
        .update({
          mode,
          redirect_url: mode === "redirect" ? redirectUrl.trim() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id)

      if (error) throw error

      toast({ title: "MedShop settings saved" })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Failed to save",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>MedShop Page</CardTitle>
          <CardDescription>
            Controls what visitors see at /medshop — the Coming Soon page, or your live store.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Mode</Label>
            <Select value={mode} onValueChange={(value) => setMode(value as "coming_soon" | "redirect")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coming_soon">Coming Soon</SelectItem>
                <SelectItem value="redirect">Redirect to URL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === "redirect" && (
            <div className="grid gap-2">
              <Label htmlFor="redirect_url">Store URL</Label>
              <Input
                id="redirect_url"
                value={redirectUrl}
                onChange={(e) => setRedirectUrl(e.target.value)}
                placeholder="https://store.example.com"
              />
              <p className="text-xs text-gray-500">
                Visitors to /medshop will be sent here instead of seeing Coming Soon.
              </p>
            </div>
          )}

          <Button type="submit" disabled={isSaving} className="bg-[#193fa6] hover:bg-[#2563eb]">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
