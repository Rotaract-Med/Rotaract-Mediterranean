import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ChevronDown, Heart } from "lucide-react"
import { Footer } from "@/components/footer"

export default function MedLovePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-pink-400 via-rose-500 to-pink-600">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ 
            backgroundImage: "url('/images/love-hero.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-pink-500/40" />
        
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <div className="w-24 h-24 mb-8 flex items-center justify-center">
            <Heart className="w-full h-full text-white drop-shadow-lg fill-white" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-center">
            med<span className="font-light italic">LOVE</span>
          </h1>
          
          <div className="animate-bounce mt-12">
            <ChevronDown className="w-12 h-12 text-white" />
          </div>
          <p className="mt-4 text-xl font-light">Discover more</p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12">
            <p className="text-sm text-pink-600 font-semibold mb-4 tracking-wider">#MEDLOVE</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-600 mb-8">
              What is med<span className="italic font-light">LOVE</span>?
            </h2>
            <div className="w-24 h-1 bg-pink-600 mb-8" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-semibold">medLOVE</span> serves as a versatile and multidisciplinary social effort to strengthen 
                vulnerable social groups at the Mediterranean region. It shall overcome the 
                discrimination towards minorities and evolve into a powerful message of <span className="font-semibold italic">LOVE</span>, a high value 
                across the Mediterranean and evolve into a powerful message of LOVE, a high value 
                across the Mediterranean.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                The Rotaract Mediterranean MDIO initiative is linked to the Rotary International 
                venue of Service and 6 Sustainable Development Goals from the United Nations:
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-md px-8 py-3 w-full sm:w-auto">
                  Download the One-Pager
                </Button>
                <Button 
                  variant="outline" 
                  className="border-pink-600 text-pink-600 hover:bg-pink-50 rounded-md px-8 py-3 w-full sm:w-auto"
                >
                  Learn how to apply for the awards
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* SDG 1 - No Poverty */}
                <div className="aspect-square bg-red-600 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-2">1</div>
                    <p className="text-xs font-semibold">NO POVERTY</p>
                  </div>
                </div>

                {/* SDG 2 - Zero Hunger */}
                <div className="aspect-square bg-yellow-500 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center text-gray-900">
                    <div className="text-6xl font-bold mb-2">2</div>
                    <p className="text-xs font-semibold">ZERO HUNGER</p>
                  </div>
                </div>

                {/* SDG 3 - Good Health and Well-Being */}
                <div className="aspect-square bg-green-600 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-2">3</div>
                    <p className="text-xs font-semibold">GOOD HEALTH AND WELL-BEING</p>
                  </div>
                </div>

                {/* SDG 4 - Quality Education */}
                <div className="aspect-square bg-red-700 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-2">4</div>
                    <p className="text-xs font-semibold">QUALITY EDUCATION</p>
                  </div>
                </div>

                {/* SDG 6 - Clean Water and Sanitation */}
                <div className="aspect-square bg-cyan-400 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-2">6</div>
                    <p className="text-xs font-semibold">CLEAN WATER AND SANITATION</p>
                  </div>
                </div>

                {/* SDG 10 - Reduced Inequalities */}
                <div className="aspect-square bg-pink-600 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl font-bold mb-2">10</div>
                    <p className="text-xs font-semibold">REDUCED INEQUALITIES</p>
                  </div>
                </div>

                {/* Rotaract Logo */}
                <div className="col-span-2 aspect-[2/1] bg-white border-2 border-gray-200 rounded-lg p-6 flex items-center justify-center">
                  <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-900 rounded-full relative">
                      <div className="absolute inset-2 border-2 border-blue-900 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto p-4 sm:p-6 md:p-8">
                <div className="text-center text-white mb-4 sm:mb-6">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">World<br />Hepatitis Day</h3>
                </div>
                
                <div className="bg-white rounded-xl p-6">
                  <p className="text-gray-700 font-semibold mb-4">#WorldHepatitisDay</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Challenge about spreading water in rural areas.
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    The action should have 3 roles:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Testing water quality (drink safe coordinator with a certain laboratory)</li>
                    <li>Methods to purifier the water (general civil members should learn children)</li>
                    <li>Sensitize people about the importance of having clean lifestyle</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-600 mb-6">
                Join the medLove <span className="text-rose-600">#Challenge</span>
              </h2>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Every year, Rotaract Mediterranean's is launching a series of <span className="font-semibold">mini challenges</span> which aim to 
                raise awareness about important topics related to social inclusion, health, education, and 
                reducing inequalities across the Mediterranean region.
              </p>
              
              <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-md px-8 py-3">
                Discover how to participate
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
