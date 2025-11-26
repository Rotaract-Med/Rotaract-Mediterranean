import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/server"
import { TeamSectionToggle } from "@/components/team-section-toggle"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default async function TeamPage() {
  const supabase = await createClient()

  // Fetch executive board members
  const { data: executiveBoard } = await supabase
    .from("team_members")
    .select("*")
    .eq("section", "executive_board")
    .order("display_order", { ascending: true })

  // Fetch country representatives
  const { data: countryRepresentatives } = await supabase
    .from("team_members")
    .select("*")
    .eq("section", "country_representatives")
    .order("display_order", { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar variant="light" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-600">Meet Our Leadership</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-[#193fa6] mb-6">
            The <span className="font-script text-pink-500">Team</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Passionate leaders from across the Mediterranean region, united in our mission to create positive change
            through youth empowerment and international collaboration.
          </p>
        </div>
      </section>

      <TeamSectionToggle executiveBoard={executiveBoard || []} countryRepresentatives={countryRepresentatives || []} />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#193fa6] to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Want to <span className="font-script">join</span> our team?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            We're always looking for passionate leaders to help us build bridges across the Mediterranean region.
          </p>
          <Button className="bg-white text-[#193fa6] hover:bg-gray-100 px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            Get Involved
            <ChevronDown className="ml-2 rotate-[-90deg]" size={20} />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
