"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Plus } from "lucide-react"
import Link from "next/link"
import DeleteHeroSlideButton from "@/components/delete-hero-slide-button"

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  image_data: string
  is_active: boolean
  display_order: number
}

interface HeroSlidesListProps {
  slides: HeroSlide[]
  canEdit: boolean
  canDelete: boolean
}

export function HeroSlidesList({ slides, canEdit, canDelete }: HeroSlidesListProps) {
  if (!slides || slides.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500 mb-4">No hero slides yet. Create your first slide to get started!</p>
          <Link href="/dashboard/hero-slides/new">
            <Button className="bg-[#193fa6] hover:bg-[#142f7a]">
              <Plus className="h-4 w-4 mr-2" />
              Add First Slide
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {slides.map((slide) => (
        <Card key={slide.id}>
          <CardContent className="p-6">
            <div className="flex gap-6">
              <div className="w-48 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={slide.image_data || "/placeholder.svg"}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=128&width=192"
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{slide.title}</h3>
                    <p className="text-gray-600 mt-1">{slide.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={slide.is_active ? "default" : "secondary"}>
                      {slide.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">Order: {slide.display_order}</Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {canEdit && (
                    <Link href={`/dashboard/hero-slides/${slide.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                  )}
                  {canDelete && <DeleteHeroSlideButton slideId={slide.id} />}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
