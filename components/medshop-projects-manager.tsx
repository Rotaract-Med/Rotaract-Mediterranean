"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MedshopProject {
  id: string
  title: string
  url: string
  display_order: number
  is_active: boolean
}

interface MedshopProjectsManagerProps {
  initialItems: MedshopProject[]
}

export function MedshopProjectsManager({ initialItems }: MedshopProjectsManagerProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [items, setItems] = useState<MedshopProject[]>(initialItems)
  const [isLoading, setIsLoading] = useState(false)
  const [newItem, setNewItem] = useState({ title: "", url: "" })

  const supabase = createClient()

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.url) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const maxOrder = Math.max(...items.map(i => i.display_order), 0)

      const { data, error } = await supabase
        .from("medshop_projects")
        .insert({
          title: newItem.title,
          url: newItem.url,
          display_order: maxOrder + 1,
          is_active: true,
        })
        .select()
        .single()

      if (error) throw error

      setItems([...items, data])
      setNewItem({ title: "", url: "" })
      toast({
        title: "Success",
        description: "Project added successfully",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("medshop_projects")
        .delete()
        .eq("id", id)

      if (error) throw error

      setItems(items.filter(item => item.id !== id))
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("medshop_projects")
        .update({ is_active: !currentStatus })
        .eq("id", id)

      if (error) throw error

      setItems(items.map(item =>
        item.id === id ? { ...item, is_active: !currentStatus } : item
      ))
      toast({
        title: "Success",
        description: `Project ${!currentStatus ? 'activated' : 'deactivated'}`,
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateItem = async (id: string, field: 'title' | 'url', value: string) => {
    try {
      const { error } = await supabase
        .from("medshop_projects")
        .update({ [field]: value })
        .eq("id", id)

      if (error) throw error

      setItems(items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ))
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const reorderedItems = [...items]
    const [movedItem] = reorderedItems.splice(fromIndex, 1)
    reorderedItems.splice(toIndex, 0, movedItem)

    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      display_order: index + 1,
    }))

    setItems(updatedItems)

    try {
      for (const item of updatedItems) {
        await supabase
          .from("medshop_projects")
          .update({ display_order: item.display_order })
          .eq("id", item.id)
      }

      toast({
        title: "Success",
        description: "Order updated successfully",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Item */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Project Name</Label>
              <Input
                id="title"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="e.g., Med Store"
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                placeholder="e.g., https://store.example.com"
              />
            </div>
          </div>
          <Button
            onClick={handleAddItem}
            disabled={isLoading}
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </CardContent>
      </Card>

      {/* Existing Items */}
      <Card>
        <CardHeader>
          <CardTitle>Current Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-4 border rounded-lg ${
                  !item.is_active ? 'bg-gray-50 opacity-60' : 'bg-white'
                }`}
              >
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={item.title}
                    onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                    onBlur={() => router.refresh()}
                    className="font-medium"
                    placeholder="Project name"
                  />
                  <Input
                    value={item.url}
                    onChange={(e) => handleUpdateItem(item.id, 'url', e.target.value)}
                    onBlur={() => router.refresh()}
                    className="text-sm text-gray-600"
                    placeholder="URL"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleActive(item.id, item.is_active)}
                  disabled={isLoading}
                >
                  {item.is_active ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No projects yet. Add one above to get started.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
