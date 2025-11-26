"use client"

import { useState } from "react"
import { Mail, Linkedin, Instagram, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"

interface TeamSectionToggleProps {
  executiveBoard: any[]
  countryRepresentatives: any[]
}

export function TeamSectionToggle({ executiveBoard, countryRepresentatives }: TeamSectionToggleProps) {
  const [activeSection, setActiveSection] = useState<"board" | "representatives">("board")

  return (
    <>
      {/* Section Toggle */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex justify-center">
          <div className="inline-flex bg-white rounded-full p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setActiveSection("board")}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeSection === "board" ? "bg-[#193fa6] text-white shadow-md" : "text-gray-600 hover:text-[#193fa6]"
              }`}
            >
              Executive Board
            </button>
            <button
              onClick={() => setActiveSection("representatives")}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeSection === "representatives"
                  ? "bg-[#193fa6] text-white shadow-md"
                  : "text-gray-600 hover:text-[#193fa6]"
              }`}
            >
              Country Representatives
            </button>
          </div>
        </div>
      </div>

      {/* Executive Board Section */}
      <section
        className={`container mx-auto px-4 pb-20 transition-all duration-500 ${
          activeSection === "board" ? "opacity-100" : "opacity-0 hidden"
        }`}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {executiveBoard.map((member: any, index: number) => (
            <Card
              key={member.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div className="relative overflow-hidden">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={member.avatar_url || "/placeholder.svg?height=400&width=400"}
                    alt={member.full_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Social Links - Appear on Hover */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
                    >
                      <Mail size={18} className="text-[#193fa6]" />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
                    >
                      <Linkedin size={18} className="text-[#193fa6]" />
                    </a>
                  )}
                  {member.instagram_url && (
                    <a
                      href={member.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
                    >
                      <Instagram size={18} className="text-[#193fa6]" />
                    </a>
                  )}
                </div>

                {/* Position Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-semibold text-[#193fa6]">{member.position}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-[#193fa6] transition-colors duration-300">
                  {member.full_name}
                </h3>
                {member.country && (
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin size={14} className="mr-1" />
                    {member.country}
                  </div>
                )}
                {member.bio && <p className="text-gray-600 leading-relaxed">{member.bio}</p>}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Country Representatives Section */}
      <section
        className={`container mx-auto px-4 pb-20 transition-all duration-500 ${
          activeSection === "representatives" ? "opacity-100" : "opacity-0 hidden"
        }`}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {countryRepresentatives.map((rep: any, index: number) => (
            <Card
              key={rep.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:-translate-y-2"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.08}s both`,
              }}
            >
              <div className="relative overflow-hidden">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={rep.avatar_url || "/placeholder.svg?height=400&width=400"}
                    alt={rep.full_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#193fa6]/90 via-[#193fa6]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Social Links - Appear on Hover */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  {rep.email && (
                    <a
                      href={`mailto:${rep.email}`}
                      className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
                    >
                      <Mail size={16} className="text-[#193fa6]" />
                    </a>
                  )}
                  {rep.linkedin_url && (
                    <a
                      href={rep.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
                    >
                      <Linkedin size={16} className="text-[#193fa6]" />
                    </a>
                  )}
                  {rep.instagram_url && (
                    <a
                      href={rep.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
                    >
                      <Instagram size={16} className="text-[#193fa6]" />
                    </a>
                  )}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#193fa6] transition-colors duration-300">
                  {rep.full_name}
                </h3>
                {rep.country && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-1" />
                    {rep.country}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
