"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { AnimatedCounter } from "@/components/animated-counter"

export default function DistrictsCountriesPage() {
  const countries = [
    {
      name: "Albania",
      code: "al",
      districts: ["District 2485"],
    },
    {
      name: "Algeria",
      code: "dz",
      districts: ["District 9010"],
    },
    {
      name: "Bosnia and Herzegovina",
      code: "ba",
      districts: ["District 1910"],
    },
    {
      name: "Croatia",
      code: "hr",
      districts: ["District 1913"],
    },
    {
      name: "Cyprus",
      code: "cy",
      districts: ["District 2452"],
    },
    {
      name: "Egypt",
      code: "eg",
      districts: ["District 2451"],
    },
    {
      name: "France",
      code: "fr",
      districts: ["Districts 1510, 1520, 1660, 1680, 1690, 1700, 1710, 1720, 1730, 1750, 1760, 1770, 1790"],
    },
    {
      name: "Greece",
      code: "gr",
      districts: ["Districts 2475"],
    },
    {
      name: "Italy",
      code: "it",
      districts: ["Districts 2032, 2041, 2060, 2071, 2072, 2080, 2090, 2101, 2102, 2110, 2120"],
    },
    {
      name: "Lebanon",
      code: "lb",
      districts: ["District 2452"],
    },
    {
      name: "Malta",
      code: "mt",
      districts: ["District 2110"],
    },
    {
      name: "Monaco",
      code: "mc",
      districts: ["District 1730"],
    },
    {
      name: "Montenegro",
      code: "me",
      districts: ["District 2483"],
    },
    {
      name: "Morocco",
      code: "ma",
      districts: ["District 9010"],
    },
    {
      name: "Slovenia",
      code: "si",
      districts: ["District 1912"],
    },
    {
      name: "Spain",
      code: "es",
      districts: ["Districts 2201, 2202, 2203"],
    },
    {
      name: "Tunisia",
      code: "tn",
      districts: ["District 9010"],
    },
    {
      name: "Turkey",
      code: "tr",
      districts: ["Districts 2420, 2430, 2440"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar variant="light" />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-[#193fa6] mb-6">
              Member Districts & Countries
            </h1>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
          </div>
        </div>

        {/* Map Section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br from-pink-50 to-red-50">
                <Image
                  src="/images/Med-Districts-Countries2-1.png"
                  alt="Mediterranean Districts and Countries Map"
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: 3, label: "Continents" },
              { number: 18, label: "Countries" },
              { number: 39, label: "Districts" },
              { number: 1000, label: "Clubs" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-300"
              >
                <AnimatedCounter 
                  end={stat.number} 
                  duration={2000}
                  className="text-4xl md:text-5xl font-bold text-[#193fa6] mb-2"
                />
                <p className="text-gray-600 font-medium text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Countries Grid */}
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Our Member Countries
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.map((country, index) => (
              <div
                key={index}
                className="bg-none "
              >
                <div className="relative h-56 bg-none  flex items-center justify-center p-6 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative w-full h-full">
                    <Image
                      src={`https://flagcdn.com/w320/${country.code}.png`}
                      alt={`${country.name} flag`}
                      fill
                      className="object-contain drop-shadow-lg"
                      unoptimized
                    />
                  </div>
                </div>
                <div className="p-2">
                  <h3 className="text-lg text-center font-bold text-gray-900 mb-2 group-hover:text-[#193fa6] transition-colors duration-300">
                    {country.name}
                  </h3>
                  <div className="space-y-0.5">
                    {country.districts.map((district, idx) => (
                      <p key={idx} className="text-xs text-center text-gray-600 leading-relaxed">
                        {district}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
