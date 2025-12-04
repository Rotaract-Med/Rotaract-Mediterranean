import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ChevronDown, Palette, Waves } from "lucide-react"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function MedCulturePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-sky-400 via-sky-500 to-sky-600">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ 
            backgroundImage: "url('/images/culture-hero.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-sky-500/40" />
        
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <div className="w-24 h-24 mb-8 flex items-center justify-center">
            <Waves className="w-full h-full text-white drop-shadow-lg" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-center">
            med<span className="font-light italic">CULTURE</span>
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
            <p className="text-sm text-sky-600 font-semibold mb-4 tracking-wider">#MEDCULTURE</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sky-600 mb-8">
              What is med<span className="italic font-light">CULTURE</span>?
            </h2>
            <div className="w-24 h-1 bg-sky-600 mb-8" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-semibold">medCULTURE</span> is a Rotaract Mediterranean MDIO project initiative which serves as a 
                versatile and multidisciplinary social effort to preserve cultural heritage and 
                promote unity in diversity. The aim is to protect cultural heritage and learn about 
                other member countries through exchange projects and twinning. Promotion of the 
                member countries' UNESCO world heritage is highly encouraged.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                The Rotaract Mediterranean MDIO initiative is linked to the Rotary International 
                theme (2019/2020): <span className="font-semibold italic">'Connecting the world'</span> and 2 Sustainable Development Goals 
                from the United Nations:
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-md px-8 py-3 w-full sm:w-auto">
                  Download the One-Pager
                </Button>
                <Button 
                  variant="outline" 
                  className="border-sky-600 text-sky-600 hover:bg-sky-50 rounded-md px-8 py-3 w-full sm:w-auto"
                >
                  Learn how to apply for the awards
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {/* SDG 16 - Peace, Justice and Strong Institutions */}
                <a
                  href="https://globalgoals.org/goals/16-peace-justice-and-strong-institutions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/SDGs/goal-16/GOAL_16_PRIMARY_ICON/GOAL_16_PNG/TheGlobalGoals_Icons_Color_Goal_16.png"
                    alt="SDG 16 - Peace, Justice and Strong Institutions"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 border-4 border-white scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    <span className="text-white font-bold text-xl tracking-wide drop-shadow-2xl">Learn more</span>
                  </div>
                </a>

                {/* SDG 17 - Partnerships for the Goals */}
                <a
                  href="https://globalgoals.org/goals/17-partnerships-for-the-goals/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/SDGs/goal-17/GOAL_17_PRIMARY_ICON/GOAL_17_PNG/TheGlobalGoals_Icons_Color_Goal_17.png"
                    alt="SDG 17 - Partnerships for the Goals"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-50"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 border-4 border-white scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    <span className="text-white font-bold text-xl tracking-wide drop-shadow-2xl">Learn more</span>
                  </div>
                </a>

                {/* UNESCO Logo */}
                <a
                  href="https://www.unesco.org/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/UNESCO_logo.png"
                    alt="UNESCO Logo"
                    width={600}
                    height={300}
                    className="w-full h-full object-contain p-6 transition-all duration-300 group-hover:brightness-50"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 border-4 border-white scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    <span className="text-white font-bold text-xl tracking-wide drop-shadow-2xl">Learn more</span>
                  </div>
                </a>

                {/* Rotaract Logo */}
                <a
                  href="https://www.rotary.org/en/get-involved/rotaract-clubs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square bg-white border-2 border-gray-200 rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/pngegg.png"
                    alt="Rotaract Logo"
                    width={600}
                    height={300}
                    className="w-full h-full object-contain p-6 transition-all duration-300 group-hover:brightness-50"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 border-4 border-white scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    <span className="text-white font-bold text-xl tracking-wide drop-shadow-2xl">Learn more</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-20 bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto">
                <div className="bg-gradient-to-br from-teal-400 to-blue-500 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-blue-500 text-xs font-bold">📍</span>
                    </div>
                    <p className="text-white text-sm">Istanbul, Turkey</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-1 mb-4">
                    <div className="flex items-center gap-2 bg-blue-50 rounded-md p-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white rounded-full" />
                      </div>
                      <p className="text-sm font-semibold text-blue-900">Rotaract Mediterranean</p>
                    </div>
                    
                    <div className="mt-3">
                      <img 
                        src="/images/istanbul-heritage.jpg" 
                        alt="Istanbul Heritage Site"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex gap-4 justify-center mt-3 pb-2">
                      <button className="text-2xl">❤️</button>
                      <button className="text-2xl">💬</button>
                      <button className="text-2xl">📤</button>
                    </div>
                  </div>
                  
                  <p className="text-white text-sm italic">It's Holiday Season People!</p>
                </div>
                
                <div className="bg-white p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full" />
                    <p className="text-xs text-gray-600">Rotaract</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-sky-600 mb-6">
                Join the medCulture <span className="text-blue-600">#Challenge</span>
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Rotaract Mediterranean's is presenting the <span className="font-semibold">#medCULTURE</span> challenge.
              </p>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                OUR territory is the most reveled in the world forolicy, history 
                and paradise? to be. And it all started in this beautiful place we call 
                "<span className="font-semibold">home</span>".
              </p>
              
              <Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-md px-8 py-3">
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
