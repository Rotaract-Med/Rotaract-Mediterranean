"use client"

import type React from "react"
import { Award } from "lucide-react"

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
}

interface AwardsCanvasClientProps {
  elements: CanvasElement[]
}

export function AwardsCanvasClient({ elements }: AwardsCanvasClientProps) {
  if (elements.length === 0) {
    return <DefaultAwardsPage />
  }

  const renderElement = (element: CanvasElement) => {
    const style: React.CSSProperties = {
      position: "absolute",
      left: `${element.x_position}${element.position_unit}`,
      top: `${element.y_position}${element.position_unit}`,
      width: `${element.width}${element.size_unit}`,
      height: `${element.height}${element.size_unit}`,
      padding: `${element.padding_top}px ${element.padding_right}px ${element.padding_bottom}px ${element.padding_left}px`,
      margin: `${element.margin_top}px ${element.margin_right}px ${element.margin_bottom}px ${element.margin_left}px`,
      backgroundColor: element.background_color,
      border: `${element.border_width}px solid ${element.border_color}`,
      borderRadius: `${element.border_radius}px`,
      boxShadow: element.box_shadow,
      transform: `rotate(${element.rotation}deg)`,
      opacity: element.opacity,
      zIndex: element.z_index,
      fontFamily: element.font_family,
      fontSize: `${element.font_size}px`,
      fontWeight: element.font_weight,
      textAlign: element.text_align as any,
      color: element.text_color,
      lineHeight: element.line_height,
    }

    let content = null

    switch (element.element_type) {
      case "heading":
      case "text":
      case "paragraph":
        content = (
          <div style={{ width: "100%", height: "100%", overflow: "hidden", wordWrap: "break-word" }}>
            {element.content.text}
          </div>
        )
        break
      case "image":
        content = (
          <img
            src={element.content.src || "/placeholder.svg?height=200&width=300"}
            alt={element.content.alt || "Award image"}
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
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)"
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(212, 175, 55, 0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            {element.content.text}
          </button>
        )
        break
      case "divider":
        content = <div style={{ width: "100%", height: "100%" }} />
        break
      case "video":
        content = (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {element.content.url ? (
              <iframe
                src={element.content.url}
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-gray-400">Video Player</div>
            )}
          </div>
        )
        break
      case "section":
        content = <div style={{ width: "100%", height: "100%" }} />
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
      <div key={element.id} style={style}>
        {content}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden">
      {/* Canvas container with relative positioning */}
      <div className="relative w-full mx-auto" style={{ minHeight: "2400px", maxWidth: "1200px" }}>
        {elements.map(renderElement)}
      </div>
    </div>
  )
}

function DefaultAwardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center px-4 max-w-2xl">
        <div className="mb-8 flex justify-center">
          <Award className="w-20 h-20 text-[#FFD700] animate-pulse" />
        </div>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#FFD700] mb-6">
          Awards & Recognition
        </h1>
        <p className="text-xl text-gray-300 mb-8">Celebrating Excellence Across the Mediterranean</p>
        <p className="text-gray-400">
          Awards content will appear here once designed in the canvas builder. Visit the dashboard to create your
          spectacular awards page.
        </p>
      </div>
    </div>
  )
}
