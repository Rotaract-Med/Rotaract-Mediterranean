"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Type,
  Heading1,
  ImageIcon,
  Square,
  Video,
  List,
  Table,
  MapPin,
  Mail,
  Download,
  Music,
  Code,
  Clock,
  Share2,
  ChevronDown,
  BarChart,
  Lightbulb,
  MessageCircle,
  FileText,
  Save,
  Eye,
  Trash2,
  Copy,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Undo,
  Redo,
  Layers,
  Settings,
  Minus,
} from "lucide-react"
import { createClient } from "@/lib/client"

interface CanvasElement {
  id: string
  element_type: string
  content: any
  x_position: number
  y_position: number
  width: number
  height: number
  padding_top: number
  padding_right: number
  padding_bottom: number
  padding_left: number
  margin_top: number
  margin_right: number
  margin_bottom: number
  margin_left: number
  background_color: string
  border_width: number
  border_color: string
  border_radius: number
  box_shadow: string
  z_index: number
  rotation: number
  opacity: number
  font_family: string
  font_size: number
  font_weight: string
  text_align: string
  text_color: string
  line_height: number
  position_unit: string
  size_unit: string
  parent_id: string | null
  is_visible: boolean
  display_order: number
}

interface WixPageBuilderProps {
  initialElements: CanvasElement[]
  mediaLibrary: any[]
}

const COMPONENT_LIBRARY = [
  { type: "heading", label: "Heading", icon: Heading1, category: "Text" },
  { type: "text", label: "Text Block", icon: Type, category: "Text" },
  { type: "paragraph", label: "Paragraph", icon: FileText, category: "Text" },
  { type: "image", label: "Image", icon: ImageIcon, category: "Media" },
  { type: "video", label: "Video", icon: Video, category: "Media" },
  { type: "gallery", label: "Gallery", icon: ImageIcon, category: "Media" },
  { type: "button", label: "Button", icon: Square, category: "Interactive" },
  { type: "divider", label: "Divider", icon: Minus, category: "Layout" },
  { type: "list", label: "List", icon: List, category: "Text" },
  { type: "table", label: "Table", icon: Table, category: "Layout" },
  { type: "map", label: "Map", icon: MapPin, category: "Embed" },
  { type: "form", label: "Contact Form", icon: Mail, category: "Interactive" },
  { type: "download", label: "Download Link", icon: Download, category: "Interactive" },
  { type: "audio", label: "Audio Player", icon: Music, category: "Media" },
  { type: "code", label: "Code Block", icon: Code, category: "Advanced" },
  { type: "countdown", label: "Countdown", icon: Clock, category: "Interactive" },
  { type: "social", label: "Social Share", icon: Share2, category: "Interactive" },
  { type: "accordion", label: "Accordion", icon: ChevronDown, category: "Layout" },
  { type: "progress", label: "Progress Bar", icon: BarChart, category: "Interactive" },
  { type: "icon", label: "Icon", icon: Lightbulb, category: "Media" },
  { type: "chat", label: "Chat Widget", icon: MessageCircle, category: "Embed" },
  { type: "section", label: "Section", icon: Square, category: "Layout" },
]

export function WixPageBuilder({ initialElements, mediaLibrary }: WixPageBuilderProps) {
  const [elements, setElements] = useState<CanvasElement[]>(initialElements)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [history, setHistory] = useState<CanvasElement[][]>([initialElements])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(0.75)
  const [showGrid, setShowGrid] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("components")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const selectedElementData = elements.find((el) => el.id === selectedElement)

  const addToHistory = useCallback(
    (newElements: CanvasElement[]) => {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newElements)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [history, historyIndex],
  )

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(history[historyIndex + 1])
    }
  }

  const getDefaultContent = (type: string) => {
    const defaults: Record<string, any> = {
      heading: { text: "Heading Text" },
      text: { text: "Text content here" },
      paragraph: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      image: { src: "", alt: "Image" },
      video: { url: "", platform: "youtube" },
      gallery: { images: [] },
      button: { text: "Click Me", link: "#" },
      divider: { style: "solid" },
      list: { items: ["Item 1", "Item 2", "Item 3"], ordered: false },
      table: { rows: 3, cols: 3, data: [] },
      map: { address: "", zoom: 12 },
      form: { fields: ["name", "email", "message"] },
      download: { text: "Download File", fileUrl: "" },
      audio: { url: "" },
      code: { code: "// Your code here", language: "javascript" },
      countdown: { targetDate: new Date().toISOString() },
      social: { platforms: ["facebook", "twitter", "linkedin"] },
      accordion: { items: [{ title: "Section 1", content: "Content 1" }] },
      progress: { value: 50, max: 100 },
      icon: { name: "star", size: 24 },
      chat: { provider: "custom" },
      section: { bgColor: "#ffffff" },
    }
    return defaults[type] || {}
  }

  const getDefaultStyles = (type: string) => {
    const styles: Record<string, Partial<CanvasElement>> = {
      heading: { font_size: 48, font_weight: "bold", text_color: "#D4AF37", height: 80 },
      text: { font_size: 16, height: 100, width: 300 },
      paragraph: { font_size: 16, line_height: 1.6, height: 120, width: 400 },
      button: { background_color: "#D4AF37", text_color: "#000000", border_radius: 8, height: 50, width: 150 },
      divider: { height: 2, width: 400, background_color: "#D4AF37" },
      section: { width: 1200, height: 400, background_color: "#f5f5f5" },
      image: { width: 300, height: 200 },
      video: { width: 560, height: 315 },
    }
    return styles[type] || {}
  }

  const addElement = (type: string) => {
    const newElement: CanvasElement = {
      id: `temp-${Date.now()}`,
      element_type: type,
      content: getDefaultContent(type),
      x_position: 100 + elements.length * 20,
      y_position: 100 + elements.length * 20,
      width: 200,
      height: 100,
      padding_top: 0,
      padding_right: 0,
      padding_bottom: 0,
      padding_left: 0,
      margin_top: 0,
      margin_right: 0,
      margin_bottom: 0,
      margin_left: 0,
      background_color: "transparent",
      border_width: 0,
      border_color: "#000000",
      border_radius: 0,
      box_shadow: "none",
      z_index: elements.length,
      rotation: 0,
      opacity: 1,
      font_family: "inherit",
      font_size: 16,
      font_weight: "normal",
      text_align: "left",
      text_color: "#000000",
      line_height: 1.5,
      position_unit: "px",
      size_unit: "px",
      parent_id: null,
      is_visible: true,
      display_order: elements.length,
      ...getDefaultStyles(type),
    }
    const newElements = [...elements, newElement]
    setElements(newElements)
    addToHistory(newElements)
    setSelectedElement(newElement.id)
    setHasUnsavedChanges(true)
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

    const newElements = elements.map((el) => {
      if (el.id === selectedElement) {
        if (isDragging) {
          const newX = Math.max(0, el.x_position + deltaX)
          const newY = Math.max(0, el.y_position + deltaY)
          return {
            ...el,
            x_position: showGrid ? Math.round(newX / 20) * 20 : newX,
            y_position: showGrid ? Math.round(newY / 20) * 20 : newY,
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
    })

    setElements(newElements)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    if (isDragging || isResizing) {
      addToHistory(elements)
    }
    setIsDragging(false)
    setIsResizing(false)
  }

  const updateElementContent = (field: string, value: any) => {
    if (!selectedElement) return
    const newElements = elements.map((el) =>
      el.id === selectedElement ? { ...el, content: { ...el.content, [field]: value } } : el,
    )
    setElements(newElements)
    setHasUnsavedChanges(true)
  }

  const updateElementProperty = (field: keyof CanvasElement, value: any) => {
    if (!selectedElement) return
    const newElements = elements.map((el) => (el.id === selectedElement ? { ...el, [field]: value } : el))
    setElements(newElements)
    setHasUnsavedChanges(true)
  }

  const deleteElement = () => {
    if (!selectedElement) return
    const newElements = elements.filter((el) => el.id !== selectedElement)
    setElements(newElements)
    addToHistory(newElements)
    setSelectedElement(null)
    setHasUnsavedChanges(true)
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
      display_order: elements.length,
    }
    const newElements = [...elements, newElement]
    setElements(newElements)
    addToHistory(newElements)
    setSelectedElement(newElement.id)
    setHasUnsavedChanges(true)
  }

  const saveCanvas = async () => {
    setIsSaving(true)
    try {
      await supabase.from("awards_canvas_elements").delete().neq("id", "00000000-0000-0000-0000-000000000000")

      const elementsToSave = elements.map((el, index) => {
        const { id, ...elementWithoutId } = el
        if (id.startsWith("temp-")) {
          return { ...elementWithoutId, display_order: index }
        } else {
          return { ...el, display_order: index }
        }
      })

      const { error } = await supabase.from("awards_canvas_elements").insert(elementsToSave)
      if (error) throw error

      setHasUnsavedChanges(false)
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
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${element.x_position}px`,
      top: `${element.y_position}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      padding: `${element.padding_top}px ${element.padding_right}px ${element.padding_bottom}px ${element.padding_left}px`,
      margin: `${element.margin_top}px ${element.margin_right}px ${element.margin_bottom}px ${element.margin_left}px`,
      backgroundColor: element.background_color,
      border: `${element.border_width}px solid ${element.border_color}`,
      borderRadius: `${element.border_radius}px`,
      boxShadow: element.box_shadow,
      transform: `rotate(${element.rotation}deg)`,
      opacity: element.opacity,
      zIndex: element.z_index,
      cursor: isDragging ? "grabbing" : "grab",
      fontFamily: element.font_family,
      fontSize: `${element.font_size}px`,
      fontWeight: element.font_weight,
      textAlign: element.text_align as any,
      color: element.text_color,
      lineHeight: element.line_height,
      outline: isSelected ? "2px solid #D4AF37" : "none",
      outlineOffset: "2px",
    }

    let content = null

    switch (element.element_type) {
      case "heading":
      case "text":
      case "paragraph":
        content = <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>{element.content.text}</div>
        break
      case "image":
        content = (
          <img
            src={element.content.src || "/placeholder.svg?height=200&width=300"}
            alt={element.content.alt}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )
        break
      case "button":
        content = (
          <button
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              cursor: "pointer",
              fontSize: "inherit",
              fontWeight: "600",
            }}
          >
            {element.content.text}
          </button>
        )
        break
      case "divider":
        content = <div style={{ width: "100%", height: "100%", backgroundColor: element.background_color }} />
        break
      case "video":
        content = (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Video className="h-12 w-12" />
          </div>
        )
        break
      case "section":
        content = (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
            }}
          >
            Section Container
          </div>
        )
        break
      default:
        content = (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
            }}
          >
            {element.element_type}
          </div>
        )
    }

    return (
      <div
        key={element.id}
        style={style}
        onMouseDown={(e) => handleMouseDown(e, element.id, "drag")}
        onClick={(e) => {
          e.stopPropagation()
          setSelectedElement(element.id)
        }}
      >
        {content}
        {isSelected && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteElement()
              }}
              className="absolute -top-8 right-0 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
              title="Delete element"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                duplicateElement()
              }}
              className="absolute -top-8 right-10 bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
              title="Duplicate element"
            >
              <Copy className="h-4 w-4" />
            </button>
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
          </>
        )}
      </div>
    )
  }

  const categories = Array.from(new Set(COMPONENT_LIBRARY.map((c) => c.category)))

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Component Library */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Components</h2>
        </div>
        <ScrollArea className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="components">Add</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
            </TabsList>
            <TabsContent value="components" className="p-4 space-y-4">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">{category}</h3>
                  <div className="space-y-1">
                    {COMPONENT_LIBRARY.filter((c) => c.category === category).map((component) => (
                      <Button
                        key={component.type}
                        onClick={() => addElement(component.type)}
                        className="w-full justify-start"
                        variant="ghost"
                        size="sm"
                      >
                        {component.icon && <component.icon className="mr-2 h-4 w-4" />}
                        {component.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="layers" className="p-4">
              <div className="space-y-1">
                {elements.map((el) => (
                  <Button
                    key={el.id}
                    onClick={() => setSelectedElement(el.id)}
                    variant={selectedElement === el.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-sm"
                    size="sm"
                  >
                    <Layers className="mr-2 h-3 w-3" />
                    {el.element_type} ({el.z_index})
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={undo} disabled={historyIndex === 0} size="sm" variant="outline">
              <Undo className="h-4 w-4" />
            </Button>
            <Button onClick={redo} disabled={historyIndex === history.length - 1} size="sm" variant="outline">
              <Redo className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <Button onClick={() => setZoom(Math.max(0.25, zoom - 0.1))} size="sm" variant="outline">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
            <Button onClick={() => setZoom(Math.min(2, zoom + 0.1))} size="sm" variant="outline">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setShowGrid(!showGrid)}
              size="sm"
              variant={showGrid ? "default" : "outline"}
              className={showGrid ? "bg-[#D4AF37] hover:bg-[#B8941F]" : ""}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && <span className="text-sm text-orange-600 font-medium">● Unsaved changes</span>}
            <span className="text-sm text-gray-600">{elements.length} elements</span>
            <Button onClick={saveCanvas} disabled={isSaving} className="bg-[#D4AF37] hover:bg-[#B8941F]">
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button asChild variant="outline">
              <a href="/awards" target="_blank" rel="noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </a>
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div
            ref={canvasRef}
            className="relative bg-white rounded-lg shadow-lg mx-auto"
            style={{
              width: "1200px",
              height: "2400px",
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              backgroundImage: showGrid
                ? "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)"
                : "none",
              backgroundSize: showGrid ? "20px 20px" : "auto",
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => setSelectedElement(null)}
          >
            {elements.map(renderElement)}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties Panel */}
      {selectedElementData ? (
        <div className="w-80 bg-white border-l flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold">Properties</h2>
            <div className="flex gap-1">
              <Button onClick={duplicateElement} size="sm" variant="outline" title="Duplicate">
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={deleteElement}
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 bg-transparent"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Content Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Content</h3>
                {(selectedElementData.element_type === "text" ||
                  selectedElementData.element_type === "heading" ||
                  selectedElementData.element_type === "paragraph") && (
                  <div className="space-y-2">
                    <Label>Text</Label>
                    <Textarea
                      value={selectedElementData.content.text}
                      onChange={(e) => updateElementContent("text", e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
                {selectedElementData.element_type === "image" && (
                  <div className="space-y-2">
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
                )}
                {selectedElementData.element_type === "button" && (
                  <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input
                      value={selectedElementData.content.text}
                      onChange={(e) => updateElementContent("text", e.target.value)}
                    />
                    <Label>Link URL</Label>
                    <Input
                      value={selectedElementData.content.link || ""}
                      onChange={(e) => updateElementContent("link", e.target.value)}
                      placeholder="https://"
                    />
                  </div>
                )}
              </div>

              {/* Layout Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Layout</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">X Position</Label>
                      <Input
                        type="number"
                        value={selectedElementData.x_position}
                        onChange={(e) => updateElementProperty("x_position", Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Y Position</Label>
                      <Input
                        type="number"
                        value={selectedElementData.y_position}
                        onChange={(e) => updateElementProperty("y_position", Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
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
              </div>

              {/* Spacing Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Spacing</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-2 block">Padding</Label>
                    <div className="grid grid-cols-4 gap-1">
                      <Input
                        type="number"
                        placeholder="T"
                        value={selectedElementData.padding_top}
                        onChange={(e) => updateElementProperty("padding_top", Number(e.target.value))}
                      />
                      <Input
                        type="number"
                        placeholder="R"
                        value={selectedElementData.padding_right}
                        onChange={(e) => updateElementProperty("padding_right", Number(e.target.value))}
                      />
                      <Input
                        type="number"
                        placeholder="B"
                        value={selectedElementData.padding_bottom}
                        onChange={(e) => updateElementProperty("padding_bottom", Number(e.target.value))}
                      />
                      <Input
                        type="number"
                        placeholder="L"
                        value={selectedElementData.padding_left}
                        onChange={(e) => updateElementProperty("padding_left", Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-2 block">Margin</Label>
                    <div className="grid grid-cols-4 gap-1">
                      <Input
                        type="number"
                        placeholder="T"
                        value={selectedElementData.margin_top}
                        onChange={(e) => updateElementProperty("margin_top", Number(e.target.value))}
                      />
                      <Input
                        type="number"
                        placeholder="R"
                        value={selectedElementData.margin_right}
                        onChange={(e) => updateElementProperty("margin_right", Number(e.target.value))}
                      />
                      <Input
                        type="number"
                        placeholder="B"
                        value={selectedElementData.margin_bottom}
                        onChange={(e) => updateElementProperty("margin_bottom", Number(e.target.value))}
                      />
                      <Input
                        type="number"
                        placeholder="L"
                        value={selectedElementData.margin_left}
                        onChange={(e) => updateElementProperty("margin_left", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Style Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Style</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={selectedElementData.background_color}
                        onChange={(e) => updateElementProperty("background_color", e.target.value)}
                        className="w-16"
                      />
                      <Input
                        type="text"
                        value={selectedElementData.background_color}
                        onChange={(e) => updateElementProperty("background_color", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Border Width</Label>
                      <Input
                        type="number"
                        value={selectedElementData.border_width}
                        onChange={(e) => updateElementProperty("border_width", Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Border Color</Label>
                      <Input
                        type="color"
                        value={selectedElementData.border_color}
                        onChange={(e) => updateElementProperty("border_color", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Border Radius</Label>
                    <Input
                      type="number"
                      value={selectedElementData.border_radius}
                      onChange={(e) => updateElementProperty("border_radius", Number(e.target.value))}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Z-Index</Label>
                      <Input
                        type="number"
                        value={selectedElementData.z_index}
                        onChange={(e) => updateElementProperty("z_index", Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Rotation</Label>
                      <Input
                        type="number"
                        value={selectedElementData.rotation}
                        onChange={(e) => updateElementProperty("rotation", Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Opacity</Label>
                      <Input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={selectedElementData.opacity}
                        onChange={(e) => updateElementProperty("opacity", Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography Section */}
              {(selectedElementData.element_type === "text" ||
                selectedElementData.element_type === "heading" ||
                selectedElementData.element_type === "paragraph" ||
                selectedElementData.element_type === "button") && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Typography</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Font Size</Label>
                      <Input
                        type="number"
                        value={selectedElementData.font_size}
                        onChange={(e) => updateElementProperty("font_size", Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Font Weight</Label>
                      <Select
                        value={selectedElementData.font_weight}
                        onValueChange={(value) => updateElementProperty("font_weight", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="600">Semi Bold</SelectItem>
                          <SelectItem value="300">Light</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={selectedElementData.text_color}
                          onChange={(e) => updateElementProperty("text_color", e.target.value)}
                          className="w-16"
                        />
                        <Input
                          type="text"
                          value={selectedElementData.text_color}
                          onChange={(e) => updateElementProperty("text_color", e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Text Align</Label>
                      <Select
                        value={selectedElementData.text_align}
                        onValueChange={(value) => updateElementProperty("text_align", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="justify">Justify</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="w-80 bg-white border-l flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Settings className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select an element to edit properties</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default WixPageBuilder
