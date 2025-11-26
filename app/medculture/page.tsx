import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ChevronDown, Waves } from "lucide-react"
import { Footer } from "@/components/footer"

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
              <div className="grid grid-cols-2 gap-4">
                {/* SDG 16 - Peace, Justice and Strong Institutions */}
                <div className="aspect-square bg-blue-600 rounded-lg p-2 sm:p-4 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold mb-1 sm:mb-2">16</div>
                    <p className="text-[0.6rem] sm:text-xs font-semibold leading-tight">PEACE, JUSTICE AND STRONG INSTITUTIONS</p>
                  </div>
                </div>

                {/* SDG 17 - Partnerships for the Goals */}
                <div className="aspect-square bg-blue-800 rounded-lg p-2 sm:p-4 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold mb-1 sm:mb-2">17</div>
                    <p className="text-[0.6rem] sm:text-xs font-semibold leading-tight">PARTNERSHIPS FOR THE GOALS</p>
                  </div>
                </div>

                {/* UNESCO Logo Placeholder */}
                <div className="col-span-2 aspect-[2/1] bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600">UNESCO</p>
                    <p className="text-xs text-gray-500">United Nations Educational, Scientific and Cultural Organization</p>
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
