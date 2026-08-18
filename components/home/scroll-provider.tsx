"use client"

import { useEffect, type ReactNode } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger } from "@/lib/gsap"

/**
 * Wires up the home page's scroll engine:
 *  - Lenis smooth scroll, ticked from GSAP's own rAF loop so it and
 *    ScrollTrigger never fall out of sync.
 *  - `ScrollTrigger.refresh()` after web fonts and images finish loading,
 *    since both change document height and every act's trigger math.
 *  - Skips Lenis entirely under `prefers-reduced-motion` — native scroll only.
 *
 * Every act still governs its OWN motion via `gsap.matchMedia()`; this
 * provider only owns the scroll surface, not what plays on it.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const refresh = () => ScrollTrigger.refresh()

    document.fonts?.ready.then(refresh).catch(() => {})
    window.addEventListener("load", refresh)

    if (prefersReducedMotion) {
      return () => window.removeEventListener("load", refresh)
    }

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenis.on("scroll", ScrollTrigger.update)

    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      window.removeEventListener("load", refresh)
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
