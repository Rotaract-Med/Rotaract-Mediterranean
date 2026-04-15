"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapPin, Users, Globe, Target } from "lucide-react"
import Image from "next/image"
import { AnimatedCounter } from "@/components/animated-counter"

export default function WhoWeArePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar variant="light" />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-[#193fa6] mb-6">
              Rotaract Mediterranean MDIO
            </h1>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 leading-relaxed">
              The MDIO program of the Rotaract Mediterranean MDIO is an{" "}
              <span className="font-semibold text-[#193fa6]">innovative international membership</span> and{" "}
              <span className="font-semibold text-[#193fa6]">leadership cultural exchange</span> program 
              designed to help members grow by learning from each other, sharing experiences, and gaining new perspectives.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white py-16 mb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-[#193fa6] rounded-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We're dedicated to unite and support cooperation in intercultural decision-making while serving others, 
                    promoting integrity and advancing world understanding, goodwill and peace through our network of business, 
                    professional and community leaders who come together to exchange ideas and take action to create lasting change.
                  </p>
                </div>
              </div>
              <div className="mt-8 p-6 bg-gradient-to-r from-[#193fa6] to-blue-600 rounded-xl text-white text-center">
                <p className="text-xl font-semibold italic uppercase">
                  A wave accross the Mediterranean
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {[
              { number: 3, label: "Continents", icon: Globe },
              { number: 18, label: "Countries", icon: MapPin },
              { number: 39, label: "Districts", icon: Target },
              { number: 1000, label: "Clubs", icon: Users },
              { number: 15007, label: "Rotaractors", icon: Users },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center group"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-50 rounded-full group-hover:bg-[#193fa6] transition-colors duration-300">
                    <stat.icon className="h-6 w-6 text-[#193fa6] group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                <AnimatedCounter 
                  end={stat.number} 
                  duration={2000}
                  className="text-4xl font-bold text-[#193fa6] mb-2"
                />
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
                Our Mediterranean Network
              </h2>
              <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                Spanning across three continents, our vibrant community connects passionate young leaders 
                throughout the Mediterranean region and beyond.
              </p>
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gradient-to-br from-pink-50 to-blue-50">
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

        {/* Values Section */}
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              What Drives Us
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Cultural Exchange",
                  description: "Learn from diverse perspectives and share experiences across borders",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  title: "Leadership Growth",
                  description: "Develop skills through collaboration and international cooperation",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  title: "Community Impact",
                  description: "Create lasting change through service and world understanding",
                  color: "from-pink-500 to-pink-600",
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${value.color}`}></div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#193fa6] transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
