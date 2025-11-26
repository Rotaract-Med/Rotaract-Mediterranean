"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Type, ImageIcon, Square, Save, Eye, Trash2, Copy, ZoomIn, ZoomOut, Grid3x3 } from "lucide-react"
import { createClient } from "@/lib/client"

interface CanvasElement {
  id: string
  element_type: string
  content: any
  x_position: number
  y_position: number
  width: number
  height: number
  z_index: number
  rotation: number
  opacity: number
  position_unit: string
  size_unit: string
  is_visible: boolean
}

interface CanvasPageBuilderProps {
  initialElements: CanvasElement[]
  mediaLibrary: any[]
}

export function CanvasPageBuilder({ initialElements, mediaLibrary }: CanvasPageBuilderProps) {
  const [elements, setElements] = useState<CanvasElement[]>(initialElements)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const selectedElementData = elements.find((el) => el.id === selectedElement)

  const addElement = (type: string) => {
    const newElement: CanvasElement = {
      id: `temp-${Date.now()}`,
      element_type: type,
      content: getDefaultContent(type),
      x_position: 100,
      y_position: 100,
      width: type === "text" ? 300 : 200,
      height: type === "text" ? 100 : 200,
      z_index: elements.length,
      rotation: 0,
      opacity: 1,
      position_unit: "px",
      size_unit: "px",
      is_visible: true,
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "text":
        return { text: "Double click to edit", fontSize: 16, color: "#000000", fontWeight: "normal" }
      case "heading":
        return { text: "Heading", fontSize: 48, color: "#D4AF37", fontWeight: "bold" }
      case "image":
        return { src: "", alt: "Image" }
      case "button":
        return { text: "Button", bgColor: "#D4AF37", textColor: "#000000" }
      case "card":
        return { bgColor: "#FFFFFF", borderColor: "#D4AF37", borderWidth: 2 }
      default:
        return {}
    }
  }

  const handleMouseDown = (e: React.MouseEvent, elementId: string, action: "drag" | "resize") => {
    e.stopPropagation()
    setSelectedElement(elementId)
    if (action === "drag") {
      setIsDragging(true)
    } else {
      setIsResizing(true)
    }
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedElement || (!isDragging && !isResizing)) return

    const deltaX = (e.clientX - dragStart.x) / zoom
    const deltaY = (e.clientY - dragStart.y) / zoom

    setElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedElement) {
          if (isDragging) {
            return {
              ...el,
              x_position: Math.max(0, el.x_position + deltaX),
              y_position: Math.max(0, el.y_position + deltaY),
            }
          } else if (isResizing) {
            return {
              ...el,
              width: Math.max(50, el.width + deltaX),
              height: Math.max(50, el.height + deltaY),
            }
          }
        }
        return el
      }),
    )

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  const updateElementContent = (field: string, value: any) => {
    if (!selectedElement) return
    setElements((prev) =>
      prev.map((el) => (el.id === selectedElement ? { ...el, content: { ...el.content, [field]: value } } : el)),
    )
  }

  const updateElementProperty = (field: keyof CanvasElement, value: any) => {
    if (!selectedElement) return
    setElements((prev) => prev.map((el) => (el.id === selectedElement ? { ...el, [field]: value } : el)))
  }

  const deleteElement = () => {
    if (!selectedElement) return
    setElements((prev) => prev.filter((el) => el.id !== selectedElement))
    setSelectedElement(null)
  }

  const duplicateElement = () => {
    if (!selectedElement) return
    const element = elements.find((el) => el.id === selectedElement)
    if (!element) return

    const newElement = {
      ...element,
      id: `temp-${Date.now()}`,
      x_position: element.x_position + 20,
      y_position: element.y_position + 20,
      z_index: elements.length,
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  const saveCanvas = async () => {
    setIsSaving(true)
    try {
      // Delete all existing elements first
      await supabase.from("awards_canvas_elements").delete().neq("id", "00000000-0000-0000-0000-000000000000")

      // Prepare elements for saving
      const elementsToSave = elements.map((el, index) => {
        const { id, ...elementWithoutId } = el

        // If it's a temp ID, don't include the id field at all (let DB generate it)
        // If it's a real UUID, include it
        if (id.startsWith("temp-")) {
          return {
            ...elementWithoutId,
            display_order: index,
          }
        } else {
          return {
            ...el,
            display_order: index,
          }
        }
      })

      const { error } = await supabase.from("awards_canvas_elements").insert(elementsToSave)

      if (error) throw error

      alert("Canvas saved successfully!")
      window.location.reload()
    } catch (error) {
      console.error("Error saving canvas:", error)
      alert("Failed to save canvas")
    } finally {
      setIsSaving(false)
    }
  }

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElement === element.id
    const style = {
      position: "absolute" as const,
      left: `${element.x_position}px`,
      top: `${element.y_position}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      transform: `rotate(${element.rotation}deg)`,
      opacity: element.opacity,
      zIndex: element.z_index,
      cursor: isDragging ? "grabbing" : "grab",
      border: isSelected ? "2px solid #D4AF37" : "1px solid transparent",
      boxShadow: isSelected ? "0 0 0 3px rgba(212, 175, 55, 0.2)" : "none",
    }

    let content = null

    switch (element.element_type) {
      case "text":
      case "heading":
        content = (
          <div
            style={{
              fontSize: `${element.content.fontSize}px`,
              color: element.content.color,
              fontWeight: element.content.fontWeight,
              padding: "8px",
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {element.content.text}
          </div>
        )
        break
      case "image":
        content = (
          <img
            src={element.content.src || "/placeholder.svg"}
            alt={element.content.alt}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )
        break
      case "button":
        content = (
          <button
            style={{
              backgroundColor: element.content.bgColor,
              color: element.content.textColor,
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              width: "100%",
              height: "100%",
            }}
          >
            {element.content.text}
          </button>
        )
        break
      case "card":
        content = (
          <div
            style={{
              backgroundColor: element.content.bgColor,
              border: `${element.content.borderWidth}px solid ${element.content.borderColor}`,
              borderRadius: "8px",
              width: "100%",
              height: "100%",
            }}
          />
        )
        break
    }

    return (
      <div
        key={element.id}
        style={style}
        onMouseDown={(e) => handleMouseDown(e, element.id, "drag")}
        onClick={() => setSelectedElement(element.id)}
      >
        {content}
        {isSelected && (
          <div
            style={{
              position: "absolute",
              bottom: -8,
              right: -8,
              width: 16,
              height: 16,
              backgroundColor: "#D4AF37",
              border: "2px solid white",
              borderRadius: "50%",
              cursor: "nwse-resize",
            }}
            onMouseDown={(e) => handleMouseDown(e, element.id, "resize")}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="w-64 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Elements</h2>
        <div className="space-y-2">
          <Button onClick={() => addElement("heading")} className="w-full justify-start" variant="outline">
            <Type className="mr-2 h-4 w-4" />
            Heading
          </Button>
          <Button onClick={() => addElement("text")} className="w-full justify-start" variant="outline">
            <Type className="mr-2 h-4 w-4" />
            Text
          </Button>
          <Button onClick={() => addElement("image")} className="w-full justify-start" variant="outline">
            <ImageIcon className="mr-2 h-4 w-4" />
            Image
          </Button>
          <Button onClick={() => addElement("button")} className="w-full justify-start" variant="outline">
            <Square className="mr-2 h-4 w-4" />
            Button
          </Button>
          <Button onClick={() => addElement("card")} className="w-full justify-start" variant="outline">
            <Square className="mr-2 h-4 w-4" />
            Card
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-3">Canvas Controls</h3>
          <div className="space-y-2">
            <Button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="w-full" variant="outline" size="sm">
              <ZoomIn className="mr-2 h-4 w-4" />
              Zoom In
            </Button>
            <Button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="w-full" variant="outline" size="sm">
              <ZoomOut className="mr-2 h-4 w-4" />
              Zoom Out
            </Button>
            <Button
              onClick={() => setShowGrid(!showGrid)}
              className="w-full"
              variant={showGrid ? "default" : "outline"}
              size="sm"
            >
              <Grid3x3 className="mr-2 h-4 w-4" />
              {showGrid ? "Hide" : "Show"} Grid
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mb-4 flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Zoom: {Math.round(zoom * 100)}%</span>
            <span className="text-sm text-gray-600">|</span>
            <span className="text-sm text-gray-600">{elements.length} elements</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveCanvas} disabled={isSaving} className="bg-[#D4AF37] hover:bg-[#B8941F]">
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Canvas"}
            </Button>
            <Button asChild variant="outline">
              <a href="/awards" target="_blank" rel="noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </a>
            </Button>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="relative bg-white rounded-lg shadow-lg mx-auto"
          style={{
            width: "1200px",
            height: "2000px",
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            backgroundImage: showGrid
              ? "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)"
              : "none",
            backgroundSize: showGrid ? "20px 20px" : "auto",
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {elements.map(renderElement)}
        </div>
      </div>

      {/* Properties Panel */}
      {selectedElementData && (
        <div className="w-80 bg-white border-l p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Properties</h2>
            <div className="flex gap-1">
              <Button onClick={duplicateElement} size="sm" variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
              <Button onClick={deleteElement} size="sm" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Position</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <Label className="text-xs">X</Label>
                  <Input
                    type="number"
                    value={selectedElementData.x_position}
                    onChange={(e) => updateElementProperty("x_position", Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label className="text-xs">Y</Label>
                  <Input
                    type="number"
                    value={selectedElementData.y_position}
                    onChange={(e) => updateElementProperty("y_position", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Size</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    value={selectedElementData.width}
                    onChange={(e) => updateElementProperty("width", Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label className="text-xs">Height</Label>
                  <Input
                    type="number"
                    value={selectedElementData.height}
                    onChange={(e) => updateElementProperty("height", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Z-Index</Label>
              <Input
                type="number"
                value={selectedElementData.z_index}
                onChange={(e) => updateElementProperty("z_index", Number(e.target.value))}
              />
            </div>

            <div>
              <Label>Rotation (degrees)</Label>
              <Input
                type="number"
                value={selectedElementData.rotation}
                onChange={(e) => updateElementProperty("rotation", Number(e.target.value))}
              />
            </div>

            <div>
              <Label>Opacity</Label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={selectedElementData.opacity}
                onChange={(e) => updateElementProperty("opacity", Number(e.target.value))}
              />
            </div>

            {/* Element-specific properties */}
            {(selectedElementData.element_type === "text" || selectedElementData.element_type === "heading") && (
              <>
                <div>
                  <Label>Text</Label>
                  <Textarea
                    value={selectedElementData.content.text}
                    onChange={(e) => updateElementContent("text", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Font Size</Label>
                  <Input
                    type="number"
                    value={selectedElementData.content.fontSize}
                    onChange={(e) => updateElementContent("fontSize", Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={selectedElementData.content.color}
                    onChange={(e) => updateElementContent("color", e.target.value)}
                  />
                </div>
              </>
            )}

            {selectedElementData.element_type === "image" && (
              <>
                <div>
                  <Label>Image Source</Label>
                  <Select
                    value={selectedElementData.content.src}
                    onValueChange={(value) => updateElementContent("src", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select image" />
                    </SelectTrigger>
                    <SelectContent>
                      {mediaLibrary.map((media) => (
                        <SelectItem key={media.id} value={media.base64_data || media.file_url}>
                          {media.file_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {selectedElementData.element_type === "button" && (
              <>
                <div>
                  <Label>Button Text</Label>
                  <Input
                    value={selectedElementData.content.text}
                    onChange={(e) => updateElementContent("text", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Background Color</Label>
                  <Input
                    type="color"
                    value={selectedElementData.content.bgColor}
                    onChange={(e) => updateElementContent("bgColor", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Text Color</Label>
                  <Input
                    type="color"
                    value={selectedElementData.content.textColor}
                    onChange={(e) => updateElementContent("textColor", e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
