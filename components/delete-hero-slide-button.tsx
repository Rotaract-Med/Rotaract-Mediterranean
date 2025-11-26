"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export default function DeleteHeroSlideButton({ slideId }: { slideId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this hero slide?")) {
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("hero_slides").delete().eq("id", slideId)

      if (error) throw error

      router.refresh()
    } catch (error: any) {
      alert("Error deleting slide: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 bg-transparent"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {loading ? "Deleting..." : "Delete"}
    </Button>
  )
}
