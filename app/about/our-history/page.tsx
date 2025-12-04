import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function OurHistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar variant="light" />
      
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/BG02.jpg"
            alt="Mediterranean background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#193fa6]/80 via-[#193fa6]/70 to-blue-900/80" />
        </div>

        {/* Content Grid */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Side - Decorative Image */}
            <div className="order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <Image
                  src="/images/BG02.jpg"
                  alt="Mediterranean Culture"
                  width={600}
                  height={700}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="order-1 md:order-2 space-y-8">
              <div>
                <p className="text-white/90 text-sm font-semibold tracking-widest mb-4 uppercase">
                  ROTARACT MEDITERRANEAN MDIO
                </p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Birth of The Med.
                </h1>
                <div className="w-24 h-1 bg-[#D4AF37] mt-6" />
              </div>

              <div className="space-y-6 text-white/90 text-lg leading-relaxed">
                <p>
                  Throughout its guiding principle of <span className="font-semibold text-white">service and fellowship</span>, 
                  Rotary International targets universal interchange and international understanding. Its programs for youth 
                  generations foster widespread exchanges and tend to create a world of complicity and prosperity, thus enabling 
                  <span className="font-semibold text-white"> Rotarians, Rotaractors, and Interactors</span> to meet, to flourish, 
                  and to provide their best.
                </p>

                <p>
                  <span className="font-semibold text-white">Rotaractors of the Mediterranean Districts</span> have been 
                  working really hard to nurture productive and sustainable relationships between each other, their districts and all 
                  over the <span className="font-semibold text-white">Mediterranean region</span>.
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="flex gap-4 pt-4">
                <div className="w-16 h-1 bg-[#D4AF37]" />
                <div className="w-16 h-1 bg-white/40" />
                <div className="w-16 h-1 bg-[#D4AF37]" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </section>

      <Footer />
    </div>
  )
}
