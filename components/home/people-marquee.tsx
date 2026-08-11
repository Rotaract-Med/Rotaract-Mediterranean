"use client"

import { useCallback, useRef } from "react"
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap"

interface PeopleMarqueeProps {
  executiveBoardImages: string[]
  countryRepImages: string[]
  collaboratorImages: string[]
}

const SECONDS_PER_TILE = 1.6
const MIN_TILES_PER_HALF = 14

/** Repeat source images until one half of the loop overflows a wide viewport. */
function buildHalf(images: string[]): string[] {
  if (images.length === 0) return []
  const out: string[] = []
  while (out.length < MIN_TILES_PER_HALF) out.push(...images)
  return out
}

/**
 * Three marquee rows of real people from Supabase, drifting in alternating
 * directions and speeding up with scroll velocity. Replaces the original
 * auto-cycling PanelCarousels.
 */
export function PeopleMarquee({ executiveBoardImages, countryRepImages, collaboratorImages }: PeopleMarqueeProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  const rows = [
    { label: "Executive Board", images: executiveBoardImages, direction: -1 as const },
    { label: "Country Representatives", images: countryRepImages, direction: 1 as const },
    { label: "Collaborators", images: collaboratorImages, direction: -1 as const },
  ]

  const setRowRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      rowRefs.current[index] = el
    },
    []
  )

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tweens = rowRefs.current.map((el, i) => {
          if (!el || !rows[i]?.images.length) return null
          const halfTiles = el.children.length / 2
          const duration = Math.max(8, halfTiles * SECONDS_PER_TILE)
          const dir = rows[i].direction
          return gsap.fromTo(
            el,
            { xPercent: dir === -1 ? 0 : -50 },
            { xPercent: dir === -1 ? -50 : 0, duration, ease: "none", repeat: -1 }
          )
        })

        const st = ScrollTrigger.create({
          trigger: wrapRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const scale = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 1200)
            tweens.forEach((t) => t && gsap.to(t, { timeScale: scale, duration: 0.3, overwrite: true }))
          },
        })

        let idle: ReturnType<typeof setTimeout>
        const onScroll = () => {
          clearTimeout(idle)
          idle = setTimeout(() => {
            tweens.forEach((t) => t && gsap.to(t, { timeScale: 1, duration: 0.8, overwrite: true }))
          }, 200)
        }
        window.addEventListener("scroll", onScroll, { passive: true })

        return () => {
          clearTimeout(idle)
          window.removeEventListener("scroll", onScroll)
          st.kill()
          tweens.forEach((t) => t?.kill())
        }
      })

      return () => mm.revert()
    },
    { scope: wrapRef, dependencies: [executiveBoardImages, countryRepImages, collaboratorImages] }
  )

  return (
    <div ref={wrapRef} className="flex flex-col gap-8">
      {rows.map((row, i) => {
        const half = buildHalf(row.images)
        const loop = [...half, ...half]
        return (
          <div key={row.label} className="overflow-hidden">
            <p className="font-data mb-3 text-[10px] uppercase tracking-[0.25em] text-white/50">{row.label}</p>
            <div ref={setRowRef(i)} className="flex w-max gap-4">
              {loop.map((src, j) => (
                <div
                  key={`${row.label}-${j}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/12 bg-white/5 lg:h-28 lg:w-28"
                >
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
