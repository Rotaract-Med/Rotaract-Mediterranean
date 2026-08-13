"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Crown, Globe, Handshake } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BookletPerson {
  id: string
  image: string
  name?: string
  role?: string
  meta?: string
}

export interface BookletCategory {
  key: string
  label: string
  people: BookletPerson[]
}

type Spread = [BookletPerson | undefined, BookletPerson | undefined]
type Curve = "l" | "r"
type Dir = "next" | "prev"

type Theme = {
  icon: typeof Crown
  tabActive: string
}

const THEME: Record<string, Theme> = {
  executive_board: { icon: Crown, tabActive: "bg-amber-500" },
  country_representatives: { icon: Globe, tabActive: "bg-[#193fa6]" },
  collaborators: { icon: Handshake, tabActive: "bg-violet-500" },
}

const DEFAULT_THEME: Theme = { icon: Globe, tabActive: "bg-gray-700" }

const MAX_DOTS = 12

function toSpreads(people: BookletPerson[]): Spread[] {
  const spreads: Spread[] = []
  for (let i = 0; i < people.length; i += 2) {
    spreads.push([people[i], people[i + 1]])
  }
  return spreads
}

function personAlt(person: BookletPerson | undefined): string {
  if (!person) return ""
  return [person.name, person.role, person.meta].filter(Boolean).join(", ")
}

// Folios are numbered sequentially across the whole book (starting at 2, as
// if page 1 were a title page), not restarted per spread.
function folioFor(spreadIdx: number, curve: Curve): number {
  return spreadIdx * 2 + (curve === "l" ? 2 : 3)
}

export function InteractiveBooklet({ categories }: { categories: BookletCategory[] }) {
  const available = categories.filter((c) => c.people && c.people.length > 0)

  const [activeKey, setActiveKey] = useState(available[0]?.key)
  const [spreadIndex, setSpreadIndex] = useState(0)
  const [flip, setFlip] = useState<{ from: number; dir: Dir } | null>(null)
  const [warmedUp, setWarmedUp] = useState(false)

  const active = available.find((c) => c.key === activeKey) ?? available[0]

  // Eagerly preload every photo in the visible category (so a mid-flip swap
  // never waits on a network fetch), then, once idle, warm the rest of the
  // categories in the background so switching tabs is just as smooth.
  useEffect(() => {
    if (!active) return
    active.people.forEach((p) => {
      if (!p.image) return
      const img = new window.Image()
      img.src = p.image
    })
  }, [active])

  useEffect(() => {
    if (warmedUp) return
    const warm = () => {
      categories.forEach((c) => {
        c.people.forEach((p) => {
          if (!p.image) return
          const img = new window.Image()
          img.src = p.image
        })
      })
      setWarmedUp(true)
    }
    const handle = window.setTimeout(warm, 1500)
    return () => window.clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!active) return null

  const spreads = toSpreads(active.people)
  const total = spreads.length
  const theme = THEME[active.key] ?? DEFAULT_THEME
  const Icon = theme.icon
  const runningLabel = active.label.toUpperCase()

  const switchCategory = (key: string) => {
    if (key === active.key) return
    setFlip(null)
    setActiveKey(key)
    setSpreadIndex(0)
  }

  const atStart = spreadIndex === 0
  const atEnd = spreadIndex === total - 1
  const busy = !!flip

  const goTo = (dir: Dir) => {
    if (busy) return
    const nextIndex = dir === "next" ? spreadIndex + 1 : spreadIndex - 1
    if (nextIndex < 0 || nextIndex >= total) return
    setFlip({ from: spreadIndex, dir })
    setSpreadIndex(nextIndex)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goTo("next")
    if (e.key === "ArrowLeft") goTo("prev")
  }

  const oldSpread = flip ? spreads[flip.from] : spreads[spreadIndex]
  const newSpread = spreads[spreadIndex]

  // The static base always shows: the side the leaf is heading TOWARD (landing on)
  // keeps its old content until the leaf actually arrives there; the side it's
  // leaving reveals the new content right away (the page that was underneath).
  let baseLeft = newSpread[0]
  let baseRight = newSpread[1]
  let baseLeftIdx = spreadIndex
  let baseRightIdx = spreadIndex
  if (flip?.dir === "next") {
    baseLeft = oldSpread[0]
    baseLeftIdx = flip.from
  }
  if (flip?.dir === "prev") {
    baseRight = oldSpread[1]
    baseRightIdx = flip.from
  }

  // The leaf is a genuine two-sided element (see globals.css): front shows the
  // outgoing photo in its home slot, back shows the incoming photo on the
  // opposite slot, and a single continuous rotation carries it across the
  // spine. backface-visibility handles which face is showing — no JS-driven
  // content swap or mirror compensation needed.
  let frontPerson: BookletPerson | undefined
  let frontCurve: Curve = "r"
  let backPerson: BookletPerson | undefined
  let backCurve: Curve = "l"
  if (flip) {
    if (flip.dir === "next") {
      frontPerson = oldSpread[1]
      frontCurve = "r"
      backPerson = newSpread[0]
      backCurve = "l"
    } else {
      frontPerson = oldSpread[0]
      frontCurve = "l"
      backPerson = newSpread[1]
      backCurve = "r"
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Category toggle — matches the segmented control used on /team */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex flex-wrap justify-center gap-1 rounded-2xl border border-gray-200 bg-white p-1 shadow-lg">
          {available.map((cat) => {
            const t = THEME[cat.key] ?? DEFAULT_THEME
            const CatIcon = t.icon
            const isActive = cat.key === active.key
            return (
              <button
                key={cat.key}
                onClick={() => switchCategory(cat.key)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300",
                  isActive ? `${t.tabActive} text-white shadow-md` : "text-gray-600 hover:text-[#193fa6]",
                )}
              >
                <CatIcon size={16} />
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="book-scene">
          {/* Floating nav arrows */}
          <button
            onClick={() => goTo("prev")}
            disabled={atStart || busy}
            aria-label="Previous page"
            className={cn(
              "absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all",
              atStart
                ? "pointer-events-none opacity-0"
                : busy
                  ? "cursor-not-allowed opacity-40"
                  : "hover:scale-110 hover:text-[#193fa6]",
            )}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => goTo("next")}
            disabled={atEnd || busy}
            aria-label="Next page"
            className={cn(
              "absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all",
              atEnd
                ? "pointer-events-none opacity-0"
                : busy
                  ? "cursor-not-allowed opacity-40"
                  : "hover:scale-110 hover:text-[#193fa6]",
            )}
          >
            <ChevronRight size={20} />
          </button>

          <div key={active.key} className="book animate-fade-in">
            <div className="book-cover">
              <div
                role="group"
                aria-roledescription="booklet"
                aria-label={`${active.label} photo booklet`}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                className="booklet-stage outline-none focus-visible:ring-2 focus-visible:ring-[#193fa6]"
              >
                <div className="edge-stack l">
                  <i /><i /><i /><i />
                </div>
                <div className="edge-stack r">
                  <i /><i /><i /><i />
                </div>

                <BookPage person={baseLeft} curve="l" runningLabel={runningLabel} folio={folioFor(baseLeftIdx, "l")} />
                <div className="spine" />
                <BookPage person={baseRight} curve="r" runningLabel={runningLabel} folio={folioFor(baseRightIdx, "r")} />

                <div className="headband top" />
                <div className="headband bot" />

                {flip && (
                  <div
                    className={cn(
                      "absolute inset-y-0 z-10 w-1/2",
                      flip.dir === "next" ? "right-0" : "left-0",
                    )}
                  >
                    <div
                      onAnimationEnd={() => setFlip(null)}
                      className={cn("booklet-leaf", flip.dir === "next" ? "leaf-turn-next" : "leaf-turn-prev")}
                    >
                      <div className="leaf-face leaf-front">
                        <BookPage
                          person={frontPerson}
                          curve={frontCurve}
                          runningLabel={runningLabel}
                          folio={folioFor(flip.from, frontCurve)}
                        />
                        <div className="leaf-shade" />
                      </div>
                      <div className="leaf-face leaf-back">
                        <BookPage
                          person={backPerson}
                          curve={backCurve}
                          runningLabel={runningLabel}
                          folio={folioFor(spreadIndex, backCurve)}
                        />
                        <div className="leaf-shade" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page indicator */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-gray-500" aria-live="polite">
        <Icon size={12} />
        <b className="font-bold text-gray-800">{spreadIndex + 1}</b> / {total}
        {total <= MAX_DOTS && (
          <span className="ml-1 flex gap-1.5">
            {spreads.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  i === spreadIndex ? "bg-[#c9a227] ring-2 ring-[#c9a227]/25" : "bg-gray-300",
                )}
              />
            ))}
          </span>
        )}
      </div>
    </div>
  )
}

function BookPage({
  person,
  curve,
  runningLabel,
  folio,
}: {
  person: BookletPerson | undefined
  curve: Curve
  runningLabel: string
  folio: number
}) {
  return (
    <div className={cn("book-page", curve === "l" ? "curve-l" : "curve-r")}>
      <div className="running-head">
        <span>{runningLabel}</span>
        <hr />
      </div>

      {person && (
        <div className="mount">
          <div className="card">
            <img src={person.image || "/placeholder.svg"} alt={personAlt(person)} className="h-full w-full object-cover" />
          </div>
          <i className="tl" />
          <i className="tr" />
          <i className="bl" />
          <i className="br" />
        </div>
      )}

      <div className="folio">{folio}</div>
    </div>
  )
}
