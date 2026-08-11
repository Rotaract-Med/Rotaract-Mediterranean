"use client"

import { useRef, type ReactNode } from "react"
import { gsap, useGSAP } from "@/lib/gsap"

interface ChapterProps {
  id?: string
  eyebrow?: string
  title?: ReactNode
  body?: ReactNode
  children?: ReactNode
  align?: "left" | "center" | "right"
  /** Extra vertical room; use "tall" when the chapter carries a grid or cards. */
  size?: "screen" | "tall" | "auto"
  className?: string
}

const alignMap = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
}

/**
 * One beat of the story, floating over the scrubbed sequence canvas.
 *
 * Chapters are ordinary flow content — no pinning — so the page's scroll
 * length is just the sum of its chapters, and that same scroll drives the
 * background sequence. Each chapter fades and drifts through the viewport so
 * something is always moving, even between beats.
 */
export function Chapter({
  id,
  eyebrow,
  title,
  body,
  children,
  align = "center",
  size = "screen",
  className = "",
}: ChapterProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const inner = ref.current?.querySelector(".chapter-inner")
        if (!inner) return
        // Rise in, hold through the middle, sink and fade out — tied to scroll
        // position so the beat reads as passing the "camera".
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
        })
        // Sharp in / long hold / sharp out, so adjacent chapters don't sit
        // half-faded on screen together — one beat reads at a time, with the
        // scrubbing sequence carrying the moments in between.
        tl.fromTo(inner, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" })
          .to(inner, { autoAlpha: 1, y: 0, duration: 0.6 })
          .to(inner, { autoAlpha: 0, y: -60, duration: 0.2, ease: "power2.in" })
        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: ref }
  )

  const height = size === "screen" ? "min-h-screen" : size === "tall" ? "min-h-[130vh]" : "py-32"

  return (
    <section
      id={id}
      ref={ref}
      className={`relative flex ${height} items-center justify-center px-6 lg:px-16 ${className}`}
    >
      <div className={`chapter-inner flex w-full max-w-5xl flex-col ${alignMap[align]}`}>
        {eyebrow && (
          <p className="font-data mb-5 text-xs uppercase tracking-[0.32em] text-[color:var(--gold-bright)]">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="font-display text-4xl font-semibold leading-[0.95] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] sm:text-5xl lg:text-7xl">
            {title}
          </h2>
        )}
        {body && (
          <div className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 drop-shadow-[0_1px_12px_rgba(0,0,0,0.6)] lg:text-lg">
            {body}
          </div>
        )}
        {children && <div className="mt-12 w-full">{children}</div>}
      </div>
    </section>
  )
}
