"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { GripVertical, Pencil, Eye, EyeOff } from "lucide-react"
import { DeleteAwardBlockButton } from "./delete-award-block-button"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Block {
  id: string
  block_type: string
  title: string | null
  subtitle: string | null
  display_order: number
  is_active: boolean
}

interface ReorderAwardBlocksProps {
  blocks: Block[]
  blockTypeLabels: Record<string, string>
}

export function ReorderAwardBlocks({ blocks: initialBlocks, blockTypeLabels }: ReorderAwardBlocksProps) {
  const [blocks, setBlocks] = useState(initialBlocks)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const router = useRouter()

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newBlocks = [...blocks]
    const draggedBlock = newBlocks[draggedIndex]
    newBlocks.splice(draggedIndex, 1)
    newBlocks.splice(index, 0, draggedBlock)

    setBlocks(newBlocks)
    setDraggedIndex(index)
  }

  const handleDragEnd = async () => {
    if (draggedIndex === null) return

    const supabase = createClient()

    // Update display_order for all blocks
    const updates = blocks.map((block, index) => ({
      id: block.id,
      display_order: index,
    }))

    for (const update of updates) {
      await supabase.from("awards_page_blocks").update({ display_order: update.display_order }).eq("id", update.id)
    }

    setDraggedIndex(null)
    router.refresh()
  }

  const toggleActive = async (blockId: string, currentState: boolean) => {
    const supabase = createClient()
    await supabase.from("awards_page_blocks").update({ is_active: !currentState }).eq("id", blockId)

    router.refresh()
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <div
          key={block.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`bg-white border-2 rounded-lg p-6 cursor-move hover:border-[#193fa6] transition-all ${
            draggedIndex === index ? "opacity-50 scale-95" : ""
          } ${!block.is_active ? "opacity-60" : ""}`}
        >
          <div className="flex items-center gap-4">
            <GripVertical className="h-6 w-6 text-gray-400 flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="px-3 py-1 bg-[#193fa6] text-white text-xs font-semibold rounded-full">
                  {blockTypeLabels[block.block_type] || block.block_type}
                </span>
                {!block.is_active && (
                  <span className="px-3 py-1 bg-gray-400 text-white text-xs font-semibold rounded-full">Hidden</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 truncate">{block.title || "Untitled Block"}</h3>
              {block.subtitle && <p className="text-sm text-gray-600 truncate">{block.subtitle}</p>}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => toggleActive(block.id, block.is_active)}>
                {block.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/awards/${block.id}/edit`}>
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <DeleteAwardBlockButton blockId={block.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
