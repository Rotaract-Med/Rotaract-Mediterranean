"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { gsap, useGSAP } from "@/lib/gsap"

export interface HeroSlide {
  image: string
  title: string
  subtitle: string
  media_type?: string
  media_url?: string
}

/**
 * The opening beat, over the sequence's dawn frames.
 *
 * The Archivo variable-width axis opens on load and narrows again as you
 * scroll away — echoing the letterspaced MEDITERRANEAN in the logo. The
 * admin-editable hero_slides media plays inside a porthole, so the dashboard
 * still drives the home page.
 */
export function HeroChapter({ heroSlides }: { heroSlides: HeroSlide[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const wordmarkRef = useRef<HTMLHeadingElement>(null)
  const [current, setCurrent] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const slide = heroSlides[current]
    videoRefs.current.forEach((v, i) => {
      if (v && i !== current) {
        v.pause()
        v.currentTime = 0
      }
    })

    if (slide?.media_type === "video" && videoRefs.current[current]) {
      const video = videoRefs.current[current]
      if (timerRef.current) clearInterval(timerRef.current)
      video!.currentTime = 0
      video!.play().catch(() => {})
      const onEnded = () => setCurrent((p) => (p + 1) % heroSlides.length)
      video!.addEventListener("ended", onEnded)
      return () => video!.removeEventListener("ended", onEnded)
    }

    timerRef.current = setInterval(() => setCurrent((p) => (p + 1) % heroSlides.length), 5000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [current, heroSlides])

  useGSAP(
    () => {
      if (!wordmarkRef.current) return
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(wordmarkRef.current, { "--wdth": 62 }, { "--wdth": 125, duration: 1.6, ease: "power3.out", delay: 0.2 })
        gsap.from(".hero-reveal, .hero-porthole", {
          autoAlpha: 0,
          y: 26,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.12,
          delay: 0.35,
        })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.8 },
        })
        tl.to(wordmarkRef.current, { "--wdth": 70, y: -90, ease: "none" }, 0)
          .to(".hero-reveal", { y: -50, autoAlpha: 0, ease: "none" }, 0)
          .to(".hero-porthole", { y: 130, scale: 0.84, autoAlpha: 0, ease: "none" }, 0)
        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(wordmarkRef.current, { "--wdth": 100 })
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  const slide = heroSlides[current]

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center px-6 lg:px-16">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 pt-24 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <p className="hero-reveal font-data mb-6 text-xs uppercase tracking-[0.32em] text-white/65">
            Rotaract MDIO · Est. 2013
          </p>
          <h1
            ref={wordmarkRef}
            className="hero-wordmark font-display text-3xl font-light leading-[0.9] text-white drop-shadow-[0_2px_28px_rgba(0,0,0,0.45)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7.5vw]"
          >
            Rotaract
            <br />
            <span className="font-semibold tracking-[0.02em]">Mediterranean</span>
          </h1>
          <p className="hero-reveal mt-8 max-w-lg text-lg font-light leading-relaxed text-white/90 drop-shadow-[0_1px_12px_rgba(0,0,0,0.5)]">
            {slide?.subtitle ??
              "Connecting Europe, the Middle East and Africa through international service, one wave at a time."}
          </p>
          <div className="hero-reveal mt-10 flex flex-wrap items-center gap-6">
            <a
              href="/about/who-we-are"
              className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#08163d] transition-transform hover:scale-105"
            >
              Learn more about us
            </a>
            <a
              href="#scale"
              className="font-data flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/75 transition-colors hover:text-white"
            >
              Begin the descent
              <ChevronDown size={16} className="animate-bounce" />
            </a>
          </div>
        </div>

        <div className="hero-porthole relative mx-auto aspect-square w-full max-w-sm">
          <div className="absolute inset-0 rounded-full border border-white/20" />
          <div className="absolute inset-3 overflow-hidden rounded-full shadow-2xl ring-1 ring-white/15">
            {heroSlides.map((s, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
              >
                {s.media_type === "video" && s.media_url ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el
                    }}
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  >
                    <source src={s.media_url} type="video/mp4" />
                  </video>
                ) : (
                  <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${s.media_url || s.image})` }} />
                )}
              </div>
            ))}
          </div>
          <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`h-2 w-2 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-wordmark {
          --wdth: 100;
          font-variation-settings: "wdth" var(--wdth);
        }
      `}</style>
    </section>
  )
}
