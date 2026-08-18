"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap"

interface SequenceCanvasProps {
  frameUrl: (index: number) => string
  frameCount: number
  /** Called with journey progress 0-1 on every scrub update. */
  onProgress?: (p: number) => void
}

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

const saveData = () => {
  if (typeof navigator === "undefined") return false
  const c = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  return Boolean(c?.saveData || /(^|-)2g$/.test(c?.effectiveType ?? ""))
}

/**
 * The whole home page's background: one fixed, full-viewport <canvas> whose
 * playhead is driven frame-by-frame by overall document scroll — an Apple-style
 * scrubbed image sequence, where the page IS the animation.
 *
 * Nothing here pins. The canvas is fixed and the page's content scrolls over
 * it, so there is no pin-spacing to collide with and scroll length is simply
 * the document's own height.
 *
 * Loading is progressive: coarse strides first so scrubbing is usable within a
 * few hundred KB, then successively filled in. Any not-yet-decoded frame falls
 * back to the nearest neighbour that is decoded, so the sequence never stalls.
 */
export function SequenceCanvas({ frameUrl, frameCount, onProgress }: SequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<(HTMLImageElement | null)[]>([])
  const drawnRef = useRef(-1)
  const playhead = useRef({ frame: 0 })
  const [loaded, setLoaded] = useState(0)
  const [staticMode, setStaticMode] = useState(false)

  const draw = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const idx = Math.max(0, Math.min(frameCount - 1, Math.round(frameIndex)))
      if (idx === drawnRef.current) return

      let img = framesRef.current[idx]
      if (!img) {
        for (let d = 1; d < frameCount; d++) {
          img = framesRef.current[idx - d] || framesRef.current[idx + d]
          if (img) break
        }
      }
      if (!img) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return
      const cw = canvas.width
      const ch = canvas.height
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
      drawnRef.current = idx
    },
    [frameCount]
  )

  // ---- progressive preload -------------------------------------------------
  useEffect(() => {
    framesRef.current = new Array(frameCount).fill(null)
    let cancelled = false
    let done = 0

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (framesRef.current[i]) return resolve()
        const img = new Image()
        img.decoding = "async"
        img.src = frameUrl(i + 1)
        const finish = (ok: boolean) => {
          if (!cancelled) {
            if (ok) framesRef.current[i] = img
            done += 1
            setLoaded(done)
            if (drawnRef.current === -1) draw(playhead.current.frame)
          }
          resolve()
        }
        img.onload = () => finish(true)
        img.onerror = () => finish(false)
      })

    if (prefersReduced() || saveData()) {
      // One representative frame, no sequence download.
      setStaticMode(true)
      load(Math.floor(frameCount * 0.12)).then(() => {
        drawnRef.current = -1
        draw(Math.floor(frameCount * 0.12))
      })
      return () => {
        cancelled = true
      }
    }

    ;(async () => {
      // Coarse-to-fine passes: usable scrubbing after the first ~30 frames.
      for (const stride of [10, 5, 2, 1]) {
        for (let i = 0; i < frameCount && !cancelled; i += stride) {
          await load(i)
        }
        if (cancelled) return
        ScrollTrigger.refresh()
      }
    })()

    return () => {
      cancelled = true
    }
  }, [frameCount, frameUrl, draw])

  // ---- sizing --------------------------------------------------------------
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      drawnRef.current = -1
      draw(playhead.current.frame)
    }
    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [draw])

  // ---- scrub ---------------------------------------------------------------
  useGSAP(() => {
    if (staticMode) return
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.to(playhead.current, {
        frame: frameCount - 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          // Refreshed last: depends on the final document height.
          refreshPriority: -10,
          onUpdate: (self) => onProgress?.(self.progress),
        },
        onUpdate: () => draw(playhead.current.frame),
      })
      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    return () => mm.revert()
  }, [frameCount, staticMode, draw])

  const pct = Math.round((loaded / frameCount) * 100)

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="fixed inset-0 -z-10 h-full w-full bg-[#08163d]" />
      {!staticMode && pct < 12 && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
          <p className="font-data text-[10px] uppercase tracking-[0.3em] text-white/50">Loading {pct}%</p>
        </div>
      )}
    </>
  )
}
