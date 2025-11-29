"use client"

import type React from "react"

import { useState } from "react"
import { Award, Trophy, Crown, Star, Sparkles, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/navbar"

interface AwardsSettings {
  id: string
  year: string
  title: string
  background_image: string | null
  hero_video_url: string | null
  hero_type: "image" | "video"
}

interface AwardsPageClientProps {
  settings: AwardsSettings | null
}

export function AwardsPageClient({ settings }: AwardsPageClientProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nominee_name: "",
    award_category: "",
    nomination_reason: "",
    nominator_email: "",
    nominator_name: "",
    nominee_email: "",
  })

  const year = settings?.year || new Date().getFullYear().toString()
  const title = settings?.title || "The Outstanding Project Awards"
  const backgroundImage = settings?.background_image
  const heroVideoUrl = settings?.hero_video_url
  const heroType = settings?.hero_type || "image"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/awards/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Nomination Submitted!",
          description: "Thank you for your nomination. We'll review it shortly.",
        })
        setFormData({
          nominee_name: "",
          award_category: "",
          nomination_reason: "",
          nominator_email: "",
          nominator_name: "",
          nominee_email: "",
        })
      } else {
        throw new Error("Submission failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit nomination. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar variant="awards" />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center md:justify-start overflow-hidden">
        {/* Background - Video or Image */}
        <div className="absolute inset-0">
          {heroType === "video" && heroVideoUrl ? (
            <>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={heroVideoUrl} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/60" />
            </>
          ) : backgroundImage ? (
            <>
              <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          )}
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#FFD700] rounded-full opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-left px-4 md:px-36 max-w-6xl ">
          <div className="">
            <div className=" ">
              <img 
              src="/images/Blue.png" 
              alt="Rotaract Mediterranean" 
              className="h-36 brightness-0 invert" 
              
            />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-center md:text-left text-white mb-12 leading-tight">
            {title.split(' ').map((word, index) => (
              <span key={index}>
                {word}
                {index < title.split(' ').length - 1 && <br />}
              </span>
            ))}
          </h1>

          <div className="animate-bounce cursor-pointer" onClick={() => document.getElementById("intro")?.scrollIntoView({ behavior: "smooth" })}>
            <p className="text-white text-sm mb-2 text-center">Discover more</p>
            <svg className="w-6 h-6 mx-auto text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section id="intro" className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-gray-400 leading-relaxed max-w-4xl mx-auto mb-8">
              Every year, the Rotaract Mediterranean Executive Board together with the Country Representatives of each one of the member countries, choose 
              the best project held by a Rotaract Club in the Mediterranean area. This is our attempt with{" "}
              <span className="text-[#D4AF37] font-semibold">The Mediterranean Outstanding Project Awards</span>,
              which are given during the Mediterranean Convention.
            </p>
            <p className="text-gray-400 leading-relaxed max-w-4xl mx-auto">
              <span className="text-[#D4AF37] font-semibold">The Mediterranean Prize for Peace</span> recognizes the work done by a Mediterranean Rotaract Club promoting and, eventually, achieving peace in 
              their communities, with <span className="text-[#D4AF37] font-semibold">the best Club Twinning Award</span>, recognizes the best collaboration between mediterranean clubs throughout the given year.
            </p>
          </div>

          {/* Award Categories */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="70" r="25" fill="#D4AF37" />
                  <path d="M30 70 L50 20 L70 70" fill="#D4AF37" />
                  <path d="M35 55 L50 30 L65 55" fill="#FFD700" />
                </svg>
              </div>
              <h3 className="text-[#D4AF37] text-2xl font-bold mb-4">Prize<br />for Peace</h3>
            </div>

            <div className="bg-white rounded-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="70" r="25" fill="#D4AF37" />
                  <path d="M30 70 L50 20 L70 70" fill="#D4AF37" />
                  <path d="M35 55 L50 30 L65 55" fill="#FFD700" />
                </svg>
              </div>
              <h3 className="text-[#D4AF37] text-xl font-bold mb-2">Outstanding<br />Project Award</h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p>| Best medLove</p>
                <p>| Best medNature</p>
                <p>| Best medCulture</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="70" r="25" fill="#D4AF37" />
                  <path d="M30 70 L50 20 L70 70" fill="#D4AF37" />
                  <path d="M35 55 L50 30 L65 55" fill="#FFD700" />
                </svg>
              </div>
              <h3 className="text-[#D4AF37] text-2xl font-bold mb-4">Best<br />Club Twinning<br />Award</h3>
            </div>
          </div>

          <div className="text-center">
            <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-md font-semibold">
              Apply Now
            </Button>
            <p className="text-gray-500 text-sm mt-4">Countdown for project submission:</p>
            <p className="text-[#D4AF37] text-sm font-semibold">(ENTER DATE - DECEMBER )</p>
          </div>
        </div>
      </section>

      {/* Selection Process Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Selection Process</h2>

          <div className="space-y-16">
            {/* Phase One */}
            <div>
              <h3 className="text-2xl font-bold text-[#D4AF37] mb-6">Phase One – Country Phase</h3>
              <p className="text-gray-400 mb-6">
                Phase one is the country phase. In this phase, each Rotaract Mediterranean MDIO member country shall submit a maximum of:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
                <li>5 projects for medLOVE OPA;</li>
                <li>5 projects for medNature OPA;</li>
                <li>5 projects for medCulture OPA;</li>
                <li>3 projects for Peace Award;</li>
                <li>3 projects for Best Twinning Award.</li>
              </ul>
              
              <h4 className="text-xl font-semibold text-white mb-4">How?</h4>
              <p className="text-gray-400 mb-4">Each country shall form a national selection committee comprised by:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-6">
                <li>Country Representative;</li>
                <li>District Rotaract Representative;</li>
                <li>District Rotaract Multipletor.</li>
              </ul>
              
              <p className="text-gray-400 mb-6">
                This committee will be in charge of choosing the projects which will represent the country in the international phase. Each country will have 
                the freedom to set up their own internal projects. The process, although it certainly gives more connected or higher visibility, also ensures 
                the selected projects are the best ones.
              </p>
              <p className="text-gray-400">
                The selected projects must be submitted to the Rotaract Mediterranean MDIO's International Service Coordinator and through awards email 
                before the 20th of March 2023 in order to start with the second phase.
              </p>
            </div>

            {/* Phase Two */}
            <div>
              <h3 className="text-2xl font-bold text-[#D4AF37] mb-6">Phase Two – International Phase</h3>
              <p className="text-gray-400 mb-6">
                The Phase Two is the International Phase, where the submitted projects will be scrutinized by the International Committee of OPA.
              </p>
              <p className="text-gray-400 mb-6">
                A maximum of 270 projects will be set for revision, assuming that all countries submit the maximum number of projects they are allowed to.
              </p>
              <p className="text-gray-400 mb-6">
                There will be a maximum of 54 projects for each category.
              </p>
              <p className="text-gray-400 mb-6">
                Country Representatives will analyze the projects provided by the International Service Coordinator and vote for the best ones, following the 
                process stated below.
              </p>
              <p className="text-gray-400 mb-6">
                The voting shall take place from 1st April 2023 until 30 April 2023.
              </p>
              
              <h4 className="text-xl font-semibold text-white mb-4">How?</h4>
              <p className="text-gray-400 mb-6">
                The Country Representatives will vote on the submitted projects (out of the 54 maximum per project). They will assign 1,2,3,4,5,7,8,10 and 12 points to 
                the chosen projects. Country Representatives will not be allowed to vote for their own country's projects.
              </p>
              <p className="text-gray-400 mb-6">
                The Country Representatives may leave the remaining projects exceeding the 9 ranked without any score.
              </p>
              <p className="text-gray-400 mb-6">
                In order to determine the winner projects from each category, the International Service Coordination team will count the submitted votes by the CRs.
              </p>
              <p className="text-gray-400 mb-6">
                The project with the highest score will be the winner in that category.
              </p>
              <p className="text-gray-400">
                Winners will be notified on 6<sup>th</sup> of May 2023 announced during the Mediterranean Convention.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button className="bg-[#D4AF37] text-black hover:bg-[#FFD700] px-12 py-4 rounded-md font-bold text-lg">
              Submit Your Project
            </Button>
          </div>
        </div>
      </section>

      {/* Award Categories Section */}
      <section id="categories" className="py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#D4AF37] mb-6">
              Award Categories
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Recognizing outstanding achievements across multiple domains of excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#D4AF37] rounded-2xl p-8 hover:shadow-2xl hover:shadow-[#FFD700]/20 transition-all duration-500 hover:scale-105 hover:border-[#FFD700]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700] opacity-5 rounded-full blur-3xl group-hover:opacity-15 transition-opacity" />

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#D4AF37] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <category.icon className="w-8 h-8 text-black" />
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-white mb-4 group-hover:text-[#FFD700] transition-colors">
                    {category.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nomination Form Section */}
      <section id="nomination-form" className="py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Award className="w-16 h-16 text-[#FFD700] mx-auto mb-6" />
            <h2 className="font-serif text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#D4AF37] mb-6">
              Submit a Nomination
            </h2>
            <p className="text-xl text-gray-400">Nominate an outstanding individual or organization for recognition</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#D4AF37] rounded-2xl p-8 space-y-6"
          >
            <div>
              <Label htmlFor="nominator_name" className="text-[#FFD700] font-semibold">
                Your Name
              </Label>
              <Input
                id="nominator_name"
                value={formData.nominator_name}
                onChange={(e) => setFormData({ ...formData, nominator_name: e.target.value })}
                className="bg-black border-[#D4AF37] text-white focus:border-[#FFD700] mt-2"
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label htmlFor="nominator_email" className="text-[#FFD700] font-semibold">
                Your Email *
              </Label>
              <Input
                id="nominator_email"
                type="email"
                required
                value={formData.nominator_email}
                onChange={(e) => setFormData({ ...formData, nominator_email: e.target.value })}
                className="bg-black border-[#D4AF37] text-white focus:border-[#FFD700] mt-2"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="border-t border-[#D4AF37] pt-6 mt-6">
              <h3 className="text-[#FFD700] font-semibold text-lg mb-4">Nominee Information</h3>
            </div>

            <div>
              <Label htmlFor="nominee_name" className="text-[#FFD700] font-semibold">
                Nominee Name *
              </Label>
              <Input
                id="nominee_name"
                required
                value={formData.nominee_name}
                onChange={(e) => setFormData({ ...formData, nominee_name: e.target.value })}
                className="bg-black border-[#D4AF37] text-white focus:border-[#FFD700] mt-2"
                placeholder="Full name of the nominee"
              />
            </div>

            <div>
              <Label htmlFor="nominee_email" className="text-[#FFD700] font-semibold">
                Nominee Email
              </Label>
              <Input
                id="nominee_email"
                type="email"
                value={formData.nominee_email}
                onChange={(e) => setFormData({ ...formData, nominee_email: e.target.value })}
                className="bg-black border-[#D4AF37] text-white focus:border-[#FFD700] mt-2"
                placeholder="nominee.email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="award_category" className="text-[#FFD700] font-semibold">
                Award Category *
              </Label>
              <Input
                id="award_category"
                required
                value={formData.award_category}
                onChange={(e) => setFormData({ ...formData, award_category: e.target.value })}
                className="bg-black border-[#D4AF37] text-white focus:border-[#FFD700] mt-2"
                placeholder="e.g., Leadership Excellence"
              />
            </div>

            <div>
              <Label htmlFor="nomination_reason" className="text-[#FFD700] font-semibold">
                Why should they receive this award? *
              </Label>
              <Textarea
                id="nomination_reason"
                required
                value={formData.nomination_reason}
                onChange={(e) => setFormData({ ...formData, nomination_reason: e.target.value })}
                className="bg-black border-[#D4AF37] text-white focus:border-[#FFD700] mt-2 min-h-32"
                placeholder="Describe their achievements and why they deserve recognition..."
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold text-lg py-6 hover:shadow-2xl hover:shadow-[#FFD700]/50 transition-all duration-300 hover:scale-105"
            >
              {isSubmitting ? "Submitting..." : "Submit Nomination"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}

const categories = [
  {
    title: "Leadership Excellence",
    description: "Recognizing outstanding leadership that inspires and drives positive change in the community.",
    icon: Crown,
  },
  {
    title: "Community Impact",
    description: "Honoring projects and initiatives that create lasting positive impact in local communities.",
    icon: Award,
  },
  {
    title: "Innovation Award",
    description: "Celebrating creative and innovative approaches to solving community challenges.",
    icon: Sparkles,
  },
  {
    title: "Youth Empowerment",
    description: "Recognizing efforts to empower and develop the next generation of leaders.",
    icon: Star,
  },
  {
    title: "Sustainability Champion",
    description: "Honoring commitment to environmental sustainability and responsible practices.",
    icon: Trophy,
  },
  {
    title: "International Cooperation",
    description: "Celebrating successful cross-border collaboration and cultural exchange initiatives.",
    icon: Award,
  },
]
