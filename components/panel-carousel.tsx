"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface PanelCarouselProps {
  title: string
  images: string[]
  description: string
}

export function PanelCarousel({ title, images, description }: PanelCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (!images || images.length === 0) return
    if (images.length === 1) return // No need to cycle if only one image
    
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 3000)
    
    return () => clearInterval(timer)
  }, [images.length]) // Only depend on length to avoid unnecessary resets

  return (
    <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden h-64">
        {images.map((image, imageIndex) => (
          <img
            key={imageIndex}
            src={image || "/placeholder.svg"}
            alt={`${title} ${imageIndex + 1}`}
            className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
              imageIndex === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex space-x-1">
            {images.map((_, imageIndex) => (
              <div
                key={imageIndex}
                className={`w-2 h-2 rounded-full transition-colors ${
                  imageIndex === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
