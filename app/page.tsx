import { createClient } from "@/lib/server"
import { HomePageClient } from "@/components/home-page-client"

export default async function RotaractMediterranean() {
  let heroSlides = null
  let collaboratorImages = null
  let countryRepImages = null
  let executiveBoardImages = null
  
  try {
    const supabase = await createClient()
    const result = await supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
    heroSlides = result.data

    // Fetch collaborator images
    const collaboratorsResult = await supabase
      .from("collaborator_images")
      .select("*")
      .order("display_order", { ascending: true })
    collaboratorImages = collaboratorsResult.data

    // Fetch country representatives avatars
    const countryRepsResult = await supabase
      .from("team_members")
      .select("avatar_url")
      .eq("section", "country_representatives")
      .not("avatar_url", "is", null)
    countryRepImages = countryRepsResult.data

    // Fetch executive board avatars
    const executiveBoardResult = await supabase
      .from("team_members")
      .select("avatar_url")
      .eq("section", "executive_board")
      .not("avatar_url", "is", null)
    executiveBoardImages = executiveBoardResult.data
  } catch (error) {
    console.error("Failed to fetch data:", error)
    // Will use default slides
  }

  // Fallback to default slides if none in database
  const defaultSlides = [
    {
      image: "/placeholder.svg?height=600&width=1200",
      title: "Welcome",
      subtitle:
        "Discover the biggest hub connecting Europe, Middle East & Africa through international service projects and events",
    },
    {
      image: "/placeholder.svg?height=600&width=1200",
      title: "Connect",
      subtitle: "Building bridges between cultures through youth leadership and community service",
    },
    {
      image: "/placeholder.svg?height=600&width=1200",
      title: "Serve",
      subtitle: "Empowering young leaders to create positive change in their communities",
    },
  ]

  const slides =
    heroSlides && heroSlides.length > 0
      ? heroSlides.map((slide: any) => ({
          image: slide.image_data,
          title: slide.title,
          subtitle: slide.subtitle,
          media_type: slide.media_type || "image",
          media_url: slide.media_url || slide.image_data,
        }))
      : defaultSlides

  const collaborators = collaboratorImages && collaboratorImages.length > 0
    ? collaboratorImages.map((img: any) => img.image_url)
    : [
        "/placeholder.svg?height=300&width=400&text=Collaborator+1",
        "/placeholder.svg?height=300&width=400&text=Collaborator+2",
        "/placeholder.svg?height=300&width=400&text=Collaborator+3",
        "/placeholder.svg?height=300&width=400&text=Collaborator+4",
      ]

  const countryReps = countryRepImages && countryRepImages.length > 0
    ? countryRepImages.map((member: any) => member.avatar_url)
    : [
        "/placeholder.svg?height=300&width=400&text=Representative+Meeting",
        "/placeholder.svg?height=300&width=400&text=Leadership+Team",
        "/placeholder.svg?height=300&width=400&text=Conference+2024",
        "/placeholder.svg?height=300&width=400&text=Youth+Leaders",
      ]

  const executiveBoard = executiveBoardImages && executiveBoardImages.length > 0
    ? executiveBoardImages.map((member: any) => member.avatar_url)
    : [
        "/placeholder.svg?height=300&width=400&text=Board+Meeting",
        "/placeholder.svg?height=300&width=400&text=Strategic+Planning",
        "/placeholder.svg?height=300&width=400&text=Annual+Assembly",
        "/placeholder.svg?height=300&width=400&text=Leadership+Summit",
      ]

  return <HomePageClient 
    heroSlides={slides} 
    collaboratorImages={collaborators}
    countryRepImages={countryReps}
    executiveBoardImages={executiveBoard}
  />
}
