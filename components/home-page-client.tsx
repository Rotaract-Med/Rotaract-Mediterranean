"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Heart, Leaf, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InteractiveBooklet, type BookletCategory } from "@/components/interactive-booklet"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

interface HeroSlide {
  image: string
  title: string
  subtitle: string
  media_type?: string
  media_url?: string
}

export function HomePageClient({
  heroSlides,
  bookletCategories,
}: {
  heroSlides: HeroSlide[],
  bookletCategories: BookletCategory[]
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startAutoPlay = (duration: number = 5000) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, duration)
  }

  useEffect(() => {
    const currentSlideData = heroSlides[currentSlide]

    // Reset all videos to start when not active
    videoRefs.current.forEach((video, idx) => {
      if (video && idx !== currentSlide) {
        video.pause()
        video.currentTime = 0
      }
    })

    // If current slide is a video, wait for it to end
    if (currentSlideData?.media_type === "video" && videoRefs.current[currentSlide]) {
      const video = videoRefs.current[currentSlide]

      if (video) {
        // Clear any existing timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }

        // Reset and play the video
        video.currentTime = 0
        video.play().catch(err => console.log("Video play failed:", err))

        // Set up video end listener
        const handleVideoEnd = () => {
          setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
        }

        video.addEventListener("ended", handleVideoEnd)

        return () => {
          video.removeEventListener("ended", handleVideoEnd)
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
        }
      }
    } else {
      // For images, use standard 5-second timer
      startAutoPlay(5000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentSlide, heroSlides])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Carousel */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            {slide.media_type === "video" && slide.media_url ? (
              <>
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el
                  }}
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={slide.media_url} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/30" />
              </>
            ) : (
              <>
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.media_url || slide.image})` }}
                >
                  <div className="absolute inset-0 bg-black/30" />
                </div>
              </>
            )}
          </div>
        ))}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-6xl md:text-8xl font-script mb-6 text-white drop-shadow-lg">
              {heroSlides[currentSlide].title}
            </h1>
            <div className="w-24 h-1 bg-white mx-auto mb-8 opacity-80" />
            <p className="text-xl md:text-2xl mb-8 leading-relaxed font-light">{heroSlides[currentSlide].subtitle}</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-full">
              Learn More About Us
            </Button>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft size={48} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
        >
          <ChevronRight size={48} />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
            />
          ))}
        </div>
      </section>

      {/* Join the Movement */}
      <section className="py-20 bg-white" id="initiatives">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#193fa6] mb-8">Join the movement!</h2>
            <p className="text-xs md:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              With the goal to unite and support rotaractors in their service and devotion in achieving  better and more sustainable future for all,  Rotaract Mediterranean carries 3 Initiatives as a General movement across the Mediterranean: medLOVE, medNATURE & medCULTURE.
              <br /><br />
              Discover more about them by clicking on their logos
              <br /><br />
              Through this wave accross the Mediterranean, the Rotaract Mediterranean MDIO supports the Sustainable Development Goals set by the United Nations which address the global challenges we face, including those related to poverty, inequality, climate, environmental degradation, prosperity, and peace and justice.
              <br /><br />
              Submit your projects and get the chance to win one of the Mediterranean Project Awards
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 ">
              <div className="rounded-lg shadow-lg">
                <a
                  href="/medlove"
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-pink-50 transition-colors cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart className="text-white" size={32} />
                  </div>
                  <div >
                    <h3 className="text-lg md:text-xl font-bold text-[#193fa6] group-hover:text-pink-600 transition-colors">medLOVE</h3>
                    <p className="text-xs md:text-base text-gray-600">Promoting social inclusion and community welfare</p>
                  </div>
                </a>
              </div>
              <div className="rounded-lg shadow-lg">
                <a
                  href="/mednature"
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-green-50 transition-colors cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Leaf className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-[#193fa6] group-hover:text-green-600 transition-colors">medNATURE</h3>
                    <p className="text-xs md:text-base text-gray-600">Environmental sustainability and conservation</p>
                  </div>
                </a>
              </div>
              <div className="rounded-lg shadow-lg">
                <a
                  href="/medculture"
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-teal-50 transition-colors cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-[#193fa6] group-hover:text-teal-600 transition-colors">medCULTURE</h3>
                    <p className="text-xs md:text-base text-gray-600">Cultural exchange and heritage preservation</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="text-center ">
              <a
                href="https://sustainabledevelopment.un.org/?menu=1300"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transition-transform hover:scale-105"
              >
                <img
                  src="/images/UNC.png"
                  alt="UN SDG Logo"
                  className="mx-auto mb-4 w-64 h-auto rounded-lg shadow-lg"
                />
              </a>
              <p className="text-sm text-gray-600">Aligned with the United Nations Sustainable Development Goals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our People — Interactive Booklet */}
      {bookletCategories.some((category) => category.people.length > 0) && (
        <section className="py-20 bg-gray-50" id="meet-our-people">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-4xl md:text-5xl font-bold text-[#193fa6] mb-4">Meet Our People</h2>
              <p className="text-sm md:text-lg text-gray-700 max-w-2xl mx-auto">
                Pick a category and flip through the pages to meet the people behind Rotaract Mediterranean.
              </p>
            </div>
            <InteractiveBooklet categories={bookletCategories} />
          </div>
        </section>
      )}
      {/* Connect & Share */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#193fa6] mb-8">Connect & Share</h2>
            <p className="text-sm md:text-lg text-gray-700 max-w-3xl mx-auto">
              Discover the Mediterranean Rotaract Club Directory.
              <br />
              We gathered the club information from all member districts and countries to make club twinnings and international collaboration projects easier for you!
              <br />
              Don’t hesitate and contact clubs from your neighbour country… or continent!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/images/Med-Districts-Countries2-1.png"
                alt="Mediterranean Map"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-6 bg-pink-50 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-pink-600 mb-2">18</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                  <div className="text-sm text-gray-600">Clubs</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-green-600 mb-2">26</div>
                  <div className="text-sm text-gray-600">Districts</div>
                </div>
                <div className="text-center p-6 bg-teal-50 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-teal-600 mb-2">3</div>
                  <div className="text-sm text-gray-600">Continents</div>
                </div>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-yellow-600 mb-2 ">15007+</div>
                <div className="text-sm text-gray-600">Rotaractors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Music Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#193fa6] mb-12">Discover our music</h2>

          <iframe
            data-testid="embed-iframe"
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/playlist/1p0H31Pk04DxWidGeiju9R?utm_source=generator"
            width="100%"
            height="450"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />


        </div>
      </section>

      <Footer />
    </div>
  )
}
