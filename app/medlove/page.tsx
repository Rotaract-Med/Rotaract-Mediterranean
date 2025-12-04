import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ChevronDown, Heart } from "lucide-react"
import { Footer } from "@/components/footer"
import Image from "next/image"

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
              <div className="grid grid-cols-3 gap-4">
                {/* SDG 1 - No Poverty */}
                <a
                  href="https://globalgoals.org/goals/1-no-poverty/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/SDGs/goal-1/GOAL_1_PRIMARY_ICON/GOAL_1_PNG/TheGlobalGoals_Icons_Color_Goal_1.png"
                    alt="SDG 1 - No Poverty"
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

                {/* SDG 2 - Zero Hunger */}
                <a
                  href="https://globalgoals.org/goals/2-zero-hunger/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/SDGs/goal-2/GOAL_2_PRIMARY_ICON/GOAL_2_PNG/TheGlobalGoals_Icons_Color_Goal_2.png"
                    alt="SDG 2 - Zero Hunger"
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

                {/* SDG 3 - Good Health and Well-Being */}
                <a
                  href="https://globalgoals.org/goals/3-good-health-and-well-being/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/SDGs/goal-3/GOAL_3_PRIMARY_ICON/GOAL_3_PNG/TheGlobalGoals_Icons_Color_Goal_3.png"
                    alt="SDG 3 - Good Health and Well-Being"
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

                {/* SDG 4 - Quality Education */}
                <a
                  href="https://globalgoals.org/goals/4-quality-education/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/SDGs/goal-4/GOAL_4_PRIMARY_ICON/GOAL_4_PNG/TheGlobalGoals_Icons_Color_Goal_4.png"
                    alt="SDG 4 - Quality Education"
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

                {/* SDG 6 - Clean Water and Sanitation */}
                <a
                  href="https://globalgoals.org/goals/6-clean-water-and-sanitation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/SDGs/goal-6/GOAL_6_PRIMARY_ICON/GOAL_6_PNG/TheGlobalGoals_Icons_Color_Goal_6.png"
                    alt="SDG 6 - Clean Water and Sanitation"
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

                {/* SDG 10 - Reduced Inequalities */}
                <a
                  href="https://globalgoals.org/goals/10-reduced-inequalities/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/SDGs/goal-10/GOAL_10_PRIMARY_ICON/GOAL_10_PNG/TheGlobalGoals_Icons_Color_Goal_10.png"
                    alt="SDG 10 - Reduced Inequalities"
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

                {/* Rotaract Logo */}
                <a
                  href="https://www.rotary.org/en/get-involved/rotaract-clubs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 aspect-[2/1] bg-white border-2 border-gray-200 rounded-lg overflow-hidden relative group block"
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
