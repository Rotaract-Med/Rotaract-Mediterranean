import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function DistrictsCountriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="light" />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Districts & Countries</h1>
          {/* Content will be added here */}
        </div>
      </main>

      <Footer />
    </div>
  )
}
