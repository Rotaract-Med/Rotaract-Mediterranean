"use client"

// Single registration point for every GSAP plugin the home page's scroll story
// uses. Everything below is free in the public `gsap` package (Club GSAP is no
// longer a paid tier) — no license key or private registry involved.
//
// Import gsap/ScrollTrigger/etc. from HERE (not directly from "gsap") so
// registration always happens exactly once, before any component uses a plugin.

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { SplitText } from "gsap/SplitText"
import { Observer } from "gsap/Observer"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP, DrawSVGPlugin, MotionPathPlugin, SplitText, Observer, ScrollToPlugin)
}

export { gsap, ScrollTrigger, useGSAP, DrawSVGPlugin, MotionPathPlugin, SplitText, Observer, ScrollToPlugin }
