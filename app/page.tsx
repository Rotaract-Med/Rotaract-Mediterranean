import { createClient } from "@/lib/server"
import { HomePageClient } from "@/components/home-page-client"
import { ComingSoonPage } from "@/components/coming-soon-page"

export default async function RotaractMediterranean() {
  // Check if site is in "Coming Soon" mode
  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true"
  
  if (isComingSoon) {
    return <ComingSoonPage />
  }
  let heroSlides = null
  let collaboratorImages = null
  let countryReps = null
  let executiveBoard = null

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

    // Fetch country representatives
    const countryRepsResult = await supabase
      .from("team_members")
      .select("id, full_name, position, country, avatar_url")
      .eq("section", "country_representatives")
      .not("avatar_url", "is", null)
      .order("display_order", { ascending: true })
    countryReps = countryRepsResult.data

    // Fetch executive board
    const executiveBoardResult = await supabase
      .from("team_members")
      .select("id, full_name, position, country, avatar_url")
      .eq("section", "executive_board")
      .not("avatar_url", "is", null)
      .order("display_order", { ascending: true })
    executiveBoard = executiveBoardResult.data
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

  // Only real entries with an image are included — a category with none
  // is simply omitted from the booklet by HomePageClient.
  const bookletCategories = [
    {
      key: "executive_board",
      label: "Executive Board",
      people: (executiveBoard || [])
        .filter((member: any) => member.avatar_url)
        .map((member: any) => ({
          id: member.id,
          image: member.avatar_url,
          name: member.full_name,
          role: member.position,
          meta: member.country,
        })),
    },
    {
      key: "country_representatives",
      label: "Country Representatives",
      people: (countryReps || [])
        .filter((member: any) => member.avatar_url)
        .map((member: any) => ({
          id: member.id,
          image: member.avatar_url,
          name: member.full_name,
          role: member.position,
          meta: member.country,
        })),
    },
    {
      key: "collaborators",
      label: "Collaborators",
      people: (collaboratorImages || [])
        .filter((img: any) => img.image_url)
        .map((img: any) => ({
          id: img.id,
          image: img.image_url,
          name: img.alt_text || undefined,
        })),
    },
  ]

  return <HomePageClient
    heroSlides={slides}
    bookletCategories={bookletCategories}
  />
}
