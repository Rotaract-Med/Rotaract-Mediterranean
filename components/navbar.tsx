"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { createClient } from "@/lib/client"

interface NavbarProps {
  variant?: "light" | "dark" | "awards" | "medtimes"
}

interface EventsSubmenuItem {
  id: string
  title: string
  url: string
  display_order: number
  is_active: boolean
}

export function Navbar({ variant = "dark" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [eventsSubmenu, setEventsSubmenu] = useState<EventsSubmenuItem[]>([])

  // Fetch events submenu items
  useEffect(() => {
    const fetchEventsSubmenu = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("events_submenu")
        .select("*")
        .eq("is_active", true)
        .order("display_order")

      if (!error && data) {
        setEventsSubmenu(data)
      }
    }

    fetchEventsSubmenu()
  }, [])

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Define styles based on variant and scroll state
  const getNavStyles = () => {
    // If scrolled on dark variant, make it solid
    if (isScrolled && variant === "dark") {
      return {
        bg: "bg-[#193fa6] border-white/20 shadow-lg",
        text: "text-white hover:text-blue-200",
        mobileBg: "bg-[#193fa6]",
        iconColor: "text-white"
      }
    }

    switch (variant) {
      case "light":
        return {
          bg: "bg-white/95 border-gray-200 shadow-sm",
          text: "text-gray-700 hover:text-[#193fa6]",
          mobileBg: "bg-white",
          iconColor: "text-white"
        }
      case "awards":
        return {
          bg: "bg-black/60 border-[#D4AF37]/30",
          text: "text-[#D4AF37] hover:text-white",
          mobileBg: "bg-black",
          iconColor: "text-gray-700"
        }
      case "medtimes":
        return {
          bg: "bg-[#193fa6]/95 border-white/20",
          text: "text-white hover:text-blue-200",
          mobileBg: "bg-[#193fa6]",
          iconColor: "text-white"
        }
      case "dark":
      default:
        return {
          bg: "bg-white/10 border-white/20",
          text: "text-white hover:text-blue-200",
          mobileBg: "bg-black/95",
          iconColor: "text-white"
        }
    }
  }

  const styles = getNavStyles()

  const navItems = [
    { name: "HOME", href: "/" },
    {
      name: "ABOUT US",
      href: "#",
      submenu: [
        { name: "WHO WE ARE", href: "/about/who-we-are" },
        { name: "DISTRICTS & COUNTRIES", href: "/about/districts-countries" },
        { name: "OUR HISTORY", href: "/about/our-history" },
        { name: "FAQS", href: "/about/faqs" },
        { name: "GUIDELINES & RESOURCES", href: "/about/guidelines-resources" },
      ]
    },
    { name: "THE TEAM", href: "/team" },
    { name: "MEDTIMES", href: "/medtimes" },
    { name: "AWARDS", href: "/awards" },
    ...(eventsSubmenu.length > 0 ? [{
      name: "EVENTS",
      href: "#",
      submenu: eventsSubmenu.map(item => ({
        name: item.title,
        href: item.url
      }))
    }] : [{
      name: "EVENTS",
      href: "#"
    }]),
    {
      name: "INITIATIVES",
      href: "#",
      submenu: [
        { name: "MED LOVE", href: "/medlove" },
        { name: "MED NATURE", href: "/mednature" },
        { name: "MED CULTURE", href: "/medculture" },
      ]
    },
    // { name: "PARTNERS", href: "#" },
    // { name: "MEDTRAVEL", href: "#" },
    // { name: "DIRECTORY", href: "#" },
    { name: "MEDSHOP", href: "/medshop" },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b ${styles.bg}`}>
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center h-16 relative">
          <a href="/" className="flex items-center absolute left-0">
            <img
              src="/images/Blue.png"
              alt="Rotaract Mediterranean"
              className="h-36"
              style={{
                filter: variant === 'medtimes' || variant === 'dark'
                  ? 'brightness(0) invert(1)'
                  : variant === 'awards'
                    ? 'brightness(0) invert(1)'
                    : 'none'
              }}
            />
          </a>
          <div className="flex items-center space-x-8 mx-auto">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.submenu ? (
                  <div
                    className="relative group"
                    onMouseEnter={() => setOpenSubmenu(item.name)}
                    onMouseLeave={() => setOpenSubmenu(null)}
                  >
                    <button
                      className={`text-xs font-medium tracking-wider transition-colors flex items-center gap-1 ${styles.text}`}
                    >
                      {item.name}
                      <ChevronDown size={16} className={`transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    {openSubmenu === item.name && (
                      <div className="absolute top-full left-0 pt-2">
                        <div className="py-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200">
                          {item.submenu.map((subItem) => (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-[#193fa6] transition-colors"
                            >
                              {subItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className={`text-xs font-medium tracking-wider transition-colors ${styles.text}`}
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between h-16">
          <a href="/" className="flex items-center">
            <img
              src="/images/Blue.png"
              alt="Rotaract Mediterranean"
              className="h-40"
              style={{
                filter: variant === 'medtimes' || variant === 'dark'
                  ? 'brightness(0) invert(1)'
                  : variant === 'awards'
                    ? 'brightness(0) invert(1)'
                    : 'none'
              }}
            />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${styles.iconColor} focus:outline-none`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`lg:hidden ${styles.mobileBg} border-t ${styles.bg.includes('border') ? styles.bg.split(' ')[1] : 'border-gray-200'}`}>
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                      className={`w-full flex items-center justify-between py-3 px-4 rounded-lg text-sm font-medium tracking-wider transition-colors ${styles.text}`}
                    >
                      {item.name}
                      <ChevronDown size={16} className={`transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    {openSubmenu === item.name && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.submenu.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => {
                              setIsOpen(false)
                              setOpenSubmenu(null)
                            }}
                            className="block py-2 px-4 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-3 px-4 rounded-lg text-sm font-medium tracking-wider transition-colors ${styles.text}`}
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
