import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ChevronDown, Leaf } from "lucide-react"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function MedNaturePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-teal-400 via-cyan-500 to-teal-600">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ 
            backgroundImage: "url('/images/nature-hero.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-teal-500/40" />
        
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <div className="w-24 h-24 mb-8 flex items-center justify-center">
            <Leaf className="w-full h-full text-white drop-shadow-lg" />
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-center">
            med<span className="font-light italic">NATURE</span>
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
            <p className="text-sm text-teal-600 font-semibold mb-4 tracking-wider">#MEDNATURE</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-teal-600 mb-8">
              What is med<span className="italic font-light">NATURE</span>?
            </h2>
            <div className="w-24 h-1 bg-teal-600 mb-8" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                <span className="font-semibold">medNATURE</span> is Rotaract Mediterranean MDIO project initiative which serves as a 
                versatile and multidisciplinary social effort to preserve the nature in the Mediterranean 
                Sea ecosystem, rise awareness and promote eco-friendly mindset and actions.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                The Rotaract Mediterranean MDIO initiative is linked to the Rotary International 
                venue of Service and 5 Sustainable Development Goals from the United Nations:
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-md px-8 py-3 w-full sm:w-auto">
                  Download the One-Pager
                </Button>
                <Button 
                  variant="outline" 
                  className="border-teal-600 text-teal-600 hover:bg-teal-50 rounded-md px-8 py-3 w-full sm:w-auto"
                >
                  Learn how to apply for the awards
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {/* SDG 7 - Affordable and Clean Energy */}
                <a
                  href="https://globalgoals.org/goals/7-affordable-and-clean-energy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/SDGs/goal-7/GOAL_7_PRIMARY_ICON/GOAL_7_PNG/TheGlobalGoals_Icons_Color_Goal_7.png"
                    alt="SDG 7 - Affordable and Clean Energy"
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

                {/* SDG 12 - Responsible Consumption and Production */}
                <a
                  href="https://globalgoals.org/goals/12-responsible-consumption-and-production/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/SDGs/goal-12/GOAL_12_PRIMARY_ICON/GOAL_12_PNG/TheGlobalGoals_Icons_Color_Goal_12.png"
                    alt="SDG 12 - Responsible Consumption and Production"
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

                {/* SDG 13 - Climate Action */}
                <a
                  href="https://globalgoals.org/goals/13-climate-action/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/SDGs/goal-13/GOAL_13_PRIMARY_ICON/GOAL_13_PNG/TheGlobalGoals_Icons_Color_Goal_13.png"
                    alt="SDG 13 - Climate Action"
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

                {/* SDG 14 - Life Below Water */}
                <a
                  href="https://globalgoals.org/goals/14-life-below-water/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/SDGs/goal-14/GOAL_14_PRIMARY_ICON/GOAL_14_PNG/TheGlobalGoals_Icons_Color_Goal_14.png"
                    alt="SDG 14 - Life Below Water"
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

                {/* SDG 15 - Life on Land */}
                <a
                  href="https://globalgoals.org/goals/15-life-on-land/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/SDGs/goal-15/GOAL_15_PRIMARY_ICON/GOAL_15_PNG/TheGlobalGoals_Icons_Color_Goal_15.png"
                    alt="SDG 15 - Life on Land"
                    width={600}
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
                  className="aspect-square bg-white border-2 border-gray-200 rounded-lg overflow-hidden relative group block"
                >
                  <Image
                    src="/images/pngegg.png"
                    alt="Rotaract Logo"
                    width={300}
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
      <section className="py-20 bg-gradient-to-br from-teal-50 to-green-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto p-4 sm:p-6 md:p-8">
                <div className="bg-white rounded-xl p-6 mb-4">
                  <div className="text-center mb-4">
                    <div className="inline-block bg-gradient-to-br from-emerald-400 to-teal-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-lg sm:text-xl md:text-2xl font-bold mb-4">
                      #CleanShores
                    </div>
                    <p className="text-teal-700 font-semibold">#MedNatureChallenges</p>
                  </div>
                  
                  <img 
                    src="/images/clean-shores.jpg" 
                    alt="Beach Cleanup"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  
                  <p className="text-sm text-gray-600 text-center">
                    Join our beach cleanup initiative
                  </p>
                </div>
                
                <p className="text-white text-center text-sm italic">
                  Together, let's make a difference
                </p>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-teal-600 mb-6">
                Join the medNature <span className="text-green-600">#Challenges</span>
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Every year, Rotaract Mediterranean's is launching a series of <span className="font-semibold">mini challenges</span> which aim 
                to raise awareness about important topics, to raise awareness about climate change and promote 
                sustainable habits and environmentally-friendly attitudes.
              </p>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Let's flex our views together. Let's wake up and think of tomorrow, let's protect our 
                planet now, let's protect us!
              </p>
              
              <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-md px-8 py-3">
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
