"use client"

import type React from "react"

import { useRef, useState, useEffect, useMemo } from "react"
import { Download, Award, FileText, Sparkles, ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { createClient } from "@/lib/client"
import { AwardsApplicationForm } from "@/components/awards-application-form"

function ContentVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(false)

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  const revealFor = (ms = 3000) => {
    setShowControls(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowControls(false), ms)
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) { video.play().catch(() => { }) } else { video.pause() }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration) return
    setCurrentTime(video.currentTime)
    setProgress((video.currentTime / video.duration) * 100)
  }

  const seek = (clientX: number, rect: DOMRect) => {
    const video = videoRef.current
    if (!video || !video.duration) return
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    video.currentTime = ratio * video.duration
  }

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) =>
    seek(e.clientX, e.currentTarget.getBoundingClientRect())

  const handleSeekTouch = (e: React.TouchEvent<HTMLDivElement>) =>
    seek(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())

  return (
    <div
      className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl shadow-black/60 bg-black"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover cursor-pointer"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
        onClick={() => { togglePlay(); revealFor() }}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
      />

      {/* Controls — hidden until hover or tap */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pt-8 pb-2 transition-opacity duration-200 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {/* Progress bar — py-2 gives a large touch/click target while bar stays slim */}
        <div
          className="w-full py-2 cursor-pointer"
          onClick={handleSeekClick}
          onTouchStart={handleSeekTouch}
        >
          <div className="w-full h-1 bg-white/30 rounded-full relative">
            <div
              className="h-full bg-[#D4AF37] rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#D4AF37] rounded-full shadow-md" />
            </div>
          </div>
        </div>
        {/* Buttons + time */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); togglePlay() }}
            className="text-white hover:text-[#D4AF37] transition-colors p-1.5 rounded-full flex-shrink-0"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); toggleMute() }}
            className="text-white hover:text-[#D4AF37] transition-colors p-1.5 rounded-full flex-shrink-0"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <span className="text-white/70 text-xs ml-1 tabular-nums">
            {fmt(currentTime)} / {fmt(duration)}
          </span>
        </div>
      </div>
    </div>
  )
}

interface AwardsSettings {
  id: string
  year: string
  title: string
  background_image: string | null
  hero_video_url: string | null
  hero_type: "image" | "video"
  content_video_url: string | null
  content_video_enabled: boolean
}

interface AwardsPageClientProps {
  settings: AwardsSettings | null
}

interface MediaFile {
  id: string
  file_name: string
  file_url: string
  s3_url?: string
  file_type: string
}

export function AwardsPageClient({ settings }: AwardsPageClientProps) {
  const supabase = createClient()
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false)
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    phase: "" as "submission" | "voting" | "ended" | "",
  })

  const year = settings?.year || new Date().getFullYear().toString()
  const title = settings?.title || "The Outstanding Project Awards"
  const backgroundImage = settings?.background_image
  const heroVideoUrl = settings?.hero_video_url
  const heroType = settings?.hero_type || "image"
  const contentVideoUrl = settings?.content_video_url
  const showContentVideo = Boolean(settings?.content_video_enabled && contentVideoUrl)

  // Generate particles data once and memoize
  const globalParticles = useMemo(() =>
    Array.from({ length: 50 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 5,
    })), []
  )

  const heroParticles = useMemo(() =>
    Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 5,
    })), []
  )

  // Countdown timer effect (using CET timezone)
  useEffect(() => {
    const calculateCountdown = () => {
      // Get current time in CET (Central European Time)
      const now = new Date()
      const currentYear = now.getFullYear()

      // Create dates in CET timezone (Europe/Paris)
      // Note: These are created as UTC dates representing CET time
      const submissionEnd = new Date(`${currentYear}-03-18T23:59:59+01:00`)
      const votingEnd = new Date(`${currentYear}-04-05T23:59:59+02:00`) // April is CEST (UTC+2)
      const submissionStart = new Date(`${currentYear}-02-25T00:00:00+01:00`)

      let targetDate: Date
      let phase: "submission" | "voting" | "ended" | "" = ""

      if (now < submissionStart) {
        targetDate = submissionStart
        phase = ""
      } else if (now <= submissionEnd) {
        targetDate = submissionEnd
        phase = "submission"
      } else if (now <= votingEnd) {
        targetDate = votingEnd
        phase = "voting"
      } else {
        phase = "ended"
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, phase: "ended" })
        return
      }

      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          phase,
        })
      }
    }

    calculateCountdown()
    const timer = setInterval(calculateCountdown, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch media files from S3/media library
  useEffect(() => {
    const fetchMediaFiles = async () => {
      const { data, error } = await supabase
        .from("media_library")
        .select("*")
        .or('file_type.eq.application/pdf,file_type.like.application/%')

      if (!error && data) {
        setMediaFiles(data)
      }
      setLoading(false)
    }

    fetchMediaFiles()
  }, [supabase])

  const getFileForResource = (fileName: string) => {
    return mediaFiles.find(file => file.file_name === fileName)
  }

  const handleDownload = async (fileName: string) => {
    const file = getFileForResource(fileName)
    if (!file) {
      alert('File not found in media library. Please contact administrator.')
      return
    }

    setDownloadingFile(fileName)
    try {
      // Use s3_url if available, otherwise use file_url
      const downloadUrl = file.s3_url || file.file_url

      // Open in new tab to trigger download
      window.open(downloadUrl, '_blank')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to download file. Please try again.')
    } finally {
      setTimeout(() => setDownloadingFile(null), 1000)
    }
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Global Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {globalParticles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#FFD700] rounded-full opacity-50"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `float ${particle.duration}s infinite ease-in-out`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
      <Navbar variant="awards" />
      {/* Hero Section */}
      <section className={`relative min-h-screen lg:h-screen flex ${showContentVideo ? "items-start py-20" : "items-center py-0"} lg:items-center lg:py-0 justify-center md:justify-start overflow-hidden`}>
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
          {heroParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#FFD700] rounded-full opacity-50"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `float ${particle.duration}s infinite ease-in-out`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className={`relative z-10 text-left px-4 md:px-36 ${showContentVideo ? "lg:w-[46%] lg:px-0 lg:pl-36 lg:flex-shrink-0" : "max-w-6xl"}`}>
          <div className="">
            <div className=" ">
              <img
                src="/images/blue.png"
                alt="Rotaract Mediterranean"
                className="h-20 sm:h-28 md:h-36 brightness-0 invert"
              />
            </div>
          </div>

          <h1 className={`font-bold text-center md:text-left text-white mb-8 md:mb-12 leading-tight ${showContentVideo ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl" : "text-4xl sm:text-5xl md:text-7xl lg:text-8xl"}`}>
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

          {/* Mobile/tablet: inline video below the text */}
          {showContentVideo && (
            <div className="mt-10 w-full lg:hidden">
              <ContentVideoPlayer src={contentVideoUrl!} />
            </div>
          )}
        </div>

        {/* Desktop: video anchored to the right side of the hero, allowed to cover the background */}
        {showContentVideo && (
          <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-6 xl:right-12 2xl:right-20 z-10 w-[52%] xl:w-[50%] 2xl:w-[48%] max-w-[900px]">
            <ContentVideoPlayer src={contentVideoUrl!} />
          </div>
        )}
      </section>

      {/* Introduction Section */}
      <section id="intro" className="py-20 px-4 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          {/* Countdown Timer */}
          <div className="mb-12">
            {countdown.phase === "submission" && (
              <>
                <p className="text-gray-400 text-sm mb-3 text-center">Time remaining for project submission:</p>
                <div className="flex justify-center gap-4 mb-2">
                  <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#D4AF37] rounded-lg p-4 min-w-[80px]">
                    <div className="text-3xl font-bold text-[#D4AF37]">{countdown.days}</div>
                    <div className="text-xs text-gray-400 uppercase">Days</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#D4AF37] rounded-lg p-4 min-w-[80px]">
                    <div className="text-3xl font-bold text-[#D4AF37]">{countdown.hours}</div>
                    <div className="text-xs text-gray-400 uppercase">Hours</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#D4AF37] rounded-lg p-4 min-w-[80px]">
                    <div className="text-3xl font-bold text-[#D4AF37]">{countdown.minutes}</div>
                    <div className="text-xs text-gray-400 uppercase">Minutes</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#D4AF37] rounded-lg p-4 min-w-[80px]">
                    <div className="text-3xl font-bold text-[#D4AF37]">{countdown.seconds}</div>
                    <div className="text-xs text-gray-400 uppercase">Seconds</div>
                  </div>
                </div>
                <p className="text-gray-500 text-xs text-center">Deadline: March 18, 2026 at 11:59 PM</p>
              </>
            )}

            {countdown.phase === "voting" && (
              <>
                <p className="text-gray-400 text-sm mb-3 text-center">Voting period - Time remaining:</p>
                <div className="flex justify-center gap-4 mb-2">
                  <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#3B82F6] rounded-lg p-4 min-w-[80px]">
                    <div className="text-3xl font-bold text-[#3B82F6]">{countdown.days}</div>
                    <div className="text-xs text-gray-400 uppercase">Days</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#3B82F6] rounded-lg p-4 min-w-[80px]">
                    <div className="text-3xl font-bold text-[#3B82F6]">{countdown.hours}</div>
                    <div className="text-xs text-gray-400 uppercase">Hours</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#3B82F6] rounded-lg p-4 min-w-[80px]">
                    <div className="text-3xl font-bold text-[#3B82F6]">{countdown.minutes}</div>
                    <div className="text-xs text-gray-400 uppercase">Minutes</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#3B82F6] rounded-lg p-4 min-w-[80px]">
                    <div className="text-3xl font-bold text-[#3B82F6]">{countdown.seconds}</div>
                    <div className="text-xs text-gray-400 uppercase">Seconds</div>
                  </div>
                </div>
                <p className="text-gray-500 text-xs text-center">Voting ends: April 5, 2026 at 11:59 PM</p>
              </>
            )}

            {countdown.phase === "ended" && (
              <div className="text-center">
                <p className="text-[#D4AF37] text-lg font-semibold">This year's awards cycle has concluded.</p>
                <p className="text-gray-400 text-sm mt-2">Thank you for your participation!</p>
              </div>
            )}

            {!countdown.phase && (
              <div className="text-center">
                <p className="text-gray-400 text-sm">Submissions open on February 25, 2026</p>
              </div>
            )}
          </div>

          <div className="mb-12 text-center">
            <p className="text-gray-400 leading-relaxed max-w-4xl mx-auto  mb-8">
              <span className="text-[#D4AF37] font-semibold">The Rotaract Mediterranean MDIO Awards</span> recognize the outstanding efforts of Rotaract clubs and are directly linked to the MED initiatives.
              They celebrate the most impactful projects that have contributed to advancing the Sustainable Development Goals across the Mediterranean region.
            </p>
            {/* <p className="text-gray-400 leading-relaxed max-w-4xl mx-auto">
              Every year, the Rotaract Mediterranean Executive Board together with the Country Representatives of each one of the member countries, choose
              the best project held by a Rotaract Club in the Mediterranean area. This is our attempt with{" "}
              <span className="text-[#D4AF37] font-semibold">The Mediterranean Outstanding Project Awards</span>,
              which are given during the Mediterranean Convention.
            </p> */}
          </div>

          {/* Award Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {awardCategories.map((category, idx) => {
              const file = getFileForResource(category.fileName)
              const isDownloading = downloadingFile === category.fileName
              const isAvailable = !loading && file

              return (
                <button
                  key={idx}
                  onClick={() => isAvailable && handleDownload(category.fileName)}
                  disabled={!isAvailable || isDownloading}
                  className="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-[#D4AF37] rounded-2xl p-8 hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all duration-500 hover:scale-105 hover:border-[#FFD700] overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-left"
                >
                  {/* Glow effect */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ backgroundColor: category.color }}
                  />

                  {/* Image container */}
                  <div className="relative z-10 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-32 h-32 object-contain drop-shadow-2xl"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm mb-4">
                      {category.description}
                    </p>

                    {/* Download indicator */}
                    <div className="flex items-center justify-center gap-2 text-[#D4AF37] font-semibold text-sm mt-4">
                      {loading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-[#D4AF37] border-t-transparent rounded-full"></div>
                          <span>Loading...</span>
                        </>
                      ) : isDownloading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-[#D4AF37] border-t-transparent rounded-full"></div>
                          <span>Opening...</span>
                        </>
                      ) : isAvailable ? (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Click to Download the application</span>
                        </>
                      ) : (
                        <span className="text-gray-500">Not Available</span>
                      )}
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div
                    className="absolute bottom-0 left-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ backgroundColor: category.color }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="0" cy="100" r="80" fill="currentColor" />
                    </svg>
                  </div>
                </button>
              )
            })}
          </div>

          {/* General Guidelines Banner */}
          <div className="relative mb-12 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] opacity-10"></div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#FFD700] rounded-full blur-3xl opacity-20 -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#D4AF37] rounded-full blur-3xl opacity-20 translate-x-32 translate-y-32"></div>

            <div className="relative border-2 border-[#D4AF37] rounded-3xl p-8 md:p-12 bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Left side - Icon and decorative elements */}
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#FFD700] to-[#D4AF37] rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
                    <Award className="w-16 h-16 text-black" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-4 h-4 text-black" />
                  </div>
                </div>

                {/* Center - Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-4 py-1 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full mb-4">
                    <span className="text-[#FFD700] text-sm font-semibold uppercase tracking-wide">Essential Resource</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Complete Awards Guidelines
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-1">
                    Everything you need to know about the Mediterranean Outstanding Project Awards - eligibility criteria,
                    submission requirements, evaluation process, and important deadlines.
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-[#FFD700] text-sm mt-4">
                    <FileText className="w-4 h-4" />
                    <span>Comprehensive PDF Guide</span>
                  </div>
                </div>

                {/* Right side - Download button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => {
                      const file = getFileForResource("MED Awards Guidelines")
                      if (file) {
                        handleDownload("MED Awards Guidelines")
                      } else {
                        alert('Guidelines file not found. Please contact administrator.')
                      }
                    }}
                    disabled={loading || downloadingFile === "MED Awards Guidelines"}
                    className="group relative bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black font-bold px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-[#FFD700]/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    {loading || downloadingFile === "MED Awards Guidelines" ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
                        <span>Opening...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>Download Guidelines</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* Application Form Modal */}
      <AwardsApplicationForm
        isOpen={isApplicationFormOpen}
        onClose={() => setIsApplicationFormOpen(false)}
      />
    </div >
  )
}

const awardCategories = [
  {
    title: "",
    description: "Celebrating projects that support vulnerable communities, reduce discrimination, and spread love.",
    image: "/images/awards/love.png",
    color: "#FF69B4",
    colorLight: "#FFB6D9",
    fileName: "MedLove Award",
  },
  {
    title: "",
    description: "Honoring initiatives that protect the ecosystem, raise awareness, and promote eco-friendly mindsets and sustainable actions.",
    image: "/images/awards/nature.png",
    color: "#10B981",
    colorLight: "#6EE7B7",
    fileName: "MedNature Award",
  },
  {
    title: "",
    description: "Highlighting projects that preserve cultural heritage, promote unity in diversity, and encourage cultural exchange.",
    image: "/images/awards/culture.png",
    color: "#fb8a4f",
    colorLight: "#fb8a4f",
    fileName: "MedCulture Award",
  },
  {
    title: "",
    description: "Acknowledging efforts that promote peace, diversity, equity, and inclusion.",
    image: "/images/awards/peace.png",
    color: "#3B82F6",
    colorLight: "#93C5FD",
    fileName: "MedPeace Award",
  },
  {
    title: "",
    description: "Celebrating successful partnerships and collaborations between Rotaract clubs in the Mediterranean.",
    image: "/images/awards/twinning.png",
    color: "#945093",
    colorLight: "#945093",
    fileName: "MedTwinning Award",
  },
  {
    title: "",
    description: "Recognizing outstanding clubs that actively participated in MED initiatives and events, demonstrating strong engagement and commitment.",
    image: "/images/awards/excellence.png",
    color: "#004aad",
    colorLight: "#004aad",
    fileName: "MedExcellence Award",
  },
]
