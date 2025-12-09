"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

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

      {/* Timeline Section */}
      <TimelineSection />

      <Footer />
    </div>
  )
}

interface TimelineEvent {
  date: string
  title: string
  description: string
  image: string
}

function TimelineSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const timelineRef = useRef<HTMLDivElement>(null)

  const events: TimelineEvent[] = [
    {
      date: "JULY 1ST, 2012",
      title: "THE IDEA WAS BORN",
      description: "The initiative of gathering all the Mediterranean Rotaract Districts started in 2012, when the District Rotaract Representative of District 9010 in Morocco, Housni Sbai Idrissi, contacted the DRR of Lebanon and a Past DRR of Italy. The idea was greatly encouraged by Past DRR Belal Ayoubi, DRR of District 2450 (now 2451 and 2452), who started working on the foundation along with District 2450 International Coordinator, Vera Damerjian.",
      image: "/images/history-map.jpg"
    },
    {
      date: "SEPTEMBER 20TH, 2012",
      title: "MEANWHILE...",
      description: "… a similar initiative had already been present within the Italian District 2110, and attempts of cooperating with Mediterranean Districts were being encouraged by Past DRR Francesco de Francesco and District Governor Francesco Socievole, namely through the project ‘Laboratories of Peace’ which aimed at creating a Mediterranean network of schools.",
      image: ""
    },
    {
      date: "NOVEMBER 15TH, 2012",
      title: "MEDITERRANEAN UNITY",
      description: "Uniting Rotary Districts around the Mediterranean Sea was warmly welcomed from the shores of Asia, Africa and Europe, thereby paving the way to place the milestone for one massive project, the Rotaract Mediterranean Multi-District Information Organization.",
      image: ""
    },
    {
      date: "DECEMBER 13TH, 2012",
      title: "1st MED PEACE FORUM",
      description: "The initial step towards reality, of a dream coming true, has been indeed taken during the first edition of the Mediterranean Peace Forum which took place in December 2012 in Pompeii, Italy. This event was a very essential occasion for the founding leaders to meet in person, and for the Med MDIO to be initiated together with the presence and the support of Mr. Wilfrid Wilkinson, Past President of the Rotary Foundation.",
      image: "/images/tour_img.jpg"
    },
    {
      date: "FEBRUARY 13TH, 2013",
      title: "ROTARY RECOGNITION",
      description: "As a result of all the efforts, Rotary International officially recognized the Med MDIO on the 13th of February, 2013, with its first four districts: 2100, 9010, 2202, and 2450 (now 2451 and 2452).",
      image: ""
    },
    {
      date: "APRIL 26TH, 2013",
      title: "1st MEDICON",
      description: "The first edition of the MEDICON was organized in April 2013 in Marrakech, Morocco, District 9010. Today, this very special event, the “Mediterranean Peace Forum” has been included in the Mediterranean Conference (Also known as MEDICON ) which takes place annually each Spring to gather the Med MDIO team members, all Mediterranean Rotarians and Rotaractors, as well as Rotary family members from all around the world.",
      image: "/images/Marrakech-full.jpg"
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"))
            setVisibleItems((prev) => {
              if (prev.includes(index)) return prev
              return [...prev, index]
            })
          }
        })
      },
      { threshold: 0.2 }
    )

    const items = timelineRef.current?.querySelectorAll("[data-timeline-item]")
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-20 bg-white" ref={timelineRef}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#193fa6] mb-4">
            Our Journey
          </h2>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
        </div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-[#193fa6]/20 h-full hidden md:block" />

          {events.map((event, index) => {
            const isLeft = index % 2 === 0
            const isVisible = visibleItems.includes(index)

            return (
              <div
                key={index}
                data-timeline-item
                data-index={index}
                className={`relative mb-16 md:mb-24 transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Content */}
                  <div
                    className={`${
                      isLeft ? "md:text-right md:pr-12" : "md:order-2 md:pl-12"
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div
                        className={`w-6 h-6 rounded-full bg-[#D4AF37] border-4 border-white shadow-lg transition-all duration-500 ${
                          isVisible ? "scale-100" : "scale-0"
                        }`}
                        style={{ transitionDelay: `${index * 150 + 300}ms` }}
                      />
                    </div>

                    <div className="space-y-4">
                      <p className="text-[#D4AF37] font-semibold text-sm tracking-wider">
                        {event.date}
                      </p>
                      <h3 className="text-2xl md:text-3xl font-bold text-[#193fa6]">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Image */}
                  {event.image && (
                    <div
                      className={`${
                        isLeft ? "md:order-2" : "md:order-1"
                      }`}
                    >
                      <div className="relative rounded-xl overflow-hidden shadow-xl group">
                        <Image
                          src={event.image}
                          alt={event.title}
                          width={500}
                          height={350}
                          className="w-full h-64"
                        />
                        <div className="absolute inset-0" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
