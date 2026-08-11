"use client"

import { useEffect, useRef, useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { useNavMenu } from "@/hooks/use-nav-menu"

interface NavLink {
  name: string
  href: string
  submenu?: { name: string; href: string; external?: boolean }[]
}

/**
 * Home-page-only navigation. Starts dissolved into the hero (transparent, no
 * bar) and re-forms into a solid glass bar once the visitor scrolls past
 * Act 0 — every other page keeps the original <Navbar/> untouched.
 *
 * Shares the Events/MedShop Supabase fetch with <Navbar/> via useNavMenu so
 * the two never drift out of sync.
 */
export function HomeNav() {
  const navRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const { eventsSubmenu, medshopProjects } = useNavMenu()

  const links: NavLink[] = [
    {
      name: "About Us",
      href: "/about/who-we-are",
      submenu: [
        { name: "Who We Are", href: "/about/who-we-are" },
        { name: "Districts & Countries", href: "/about/districts-countries" },
        { name: "Our History", href: "/about/our-history" },
        { name: "FAQs", href: "/about/faqs" },
        { name: "Guidelines & Resources", href: "/about/guidelines-resources" },
      ],
    },
    { name: "The Team", href: "/team" },
    { name: "MEDTimes", href: "/medtimes" },
    { name: "Awards", href: "/awards" },
    {
      name: "Events",
      href: "#",
      submenu: eventsSubmenu.map((item) => ({ name: item.title, href: item.url, external: true })),
    },
    {
      name: "Initiatives",
      href: "#",
      submenu: [
        { name: "medLOVE", href: "/medlove" },
        { name: "medNATURE", href: "/mednature" },
        { name: "medCULTURE", href: "/medculture" },
      ],
    },
    {
      name: "MedShop",
      href: "/medshop",
      submenu: medshopProjects.map((item) => ({ name: item.title, href: item.url, external: true })),
    },
  ]

  // Solid-glass once scrolled past the hero — a plain scroll listener rather
  // than a ScrollTrigger, since this is a simple threshold check (matching
  // the same pattern the shared <Navbar/> already uses) and stays reliable
  // regardless of how much the document's total height shifts as Act 2's
  // pinned section and images below it finish loading.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 120)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Escape closes the mobile panel and any open submenu.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpenSubmenu(null)
      setIsOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <nav
      ref={navRef}
      className={`fixed left-0 right-0 top-0 z-40 transition-colors duration-500 ${
        isScrolled ? "bg-[#08163d]/85 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <a href="/" className="flex items-center">
          <img src="/images/blue.png" alt="Rotaract Mediterranean" className="h-11 w-auto brightness-0 invert" />
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <div
              key={link.name}
              className="relative"
              onMouseEnter={() => link.submenu && setOpenSubmenu(link.name)}
              onMouseLeave={() => link.submenu && setOpenSubmenu(null)}
            >
              {link.submenu ? (
                <button
                  className="font-data flex items-center gap-1 text-[11px] uppercase tracking-[0.15em] text-white/85 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--gold-bright)]"
                  aria-expanded={openSubmenu === link.name}
                  onClick={() => setOpenSubmenu(openSubmenu === link.name ? null : link.name)}
                >
                  {link.name}
                  <ChevronDown size={13} className={`transition-transform ${openSubmenu === link.name ? "rotate-180" : ""}`} />
                </button>
              ) : (
                <a
                  href={link.href}
                  className="font-data text-[11px] uppercase tracking-[0.15em] text-white/85 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--gold-bright)]"
                >
                  {link.name}
                </a>
              )}
              {link.submenu && openSubmenu === link.name && (
                <div className="absolute left-0 top-full w-56 pt-3">
                  <div className="rounded-xl border border-white/10 bg-[#08163d]/95 py-2 shadow-2xl backdrop-blur-md">
                    {link.submenu.length === 0 ? (
                      <span className="block px-4 py-2 text-xs text-white/50">Coming soon</span>
                    ) : (
                      link.submenu.map((sub) => (
                        <a
                          key={sub.name}
                          href={sub.href}
                          target={sub.external ? "_blank" : undefined}
                          rel={sub.external ? "noopener noreferrer" : undefined}
                          className="block px-4 py-2 text-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {sub.name}
                        </a>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-full text-white/90 lg:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div
          ref={panelRef}
          className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-[#08163d] px-6 pb-10 pt-28 lg:hidden"
        >
          {links.map((link) => (
            <div key={link.name} className="border-b border-white/10 py-3">
              {link.submenu ? (
                <>
                  <button
                    className="font-data flex w-full items-center justify-between text-sm uppercase tracking-[0.15em] text-white/90"
                    aria-expanded={openSubmenu === link.name}
                    onClick={() => setOpenSubmenu(openSubmenu === link.name ? null : link.name)}
                  >
                    {link.name}
                    <ChevronDown size={16} className={`transition-transform ${openSubmenu === link.name ? "rotate-180" : ""}`} />
                  </button>
                  {openSubmenu === link.name && (
                    <div className="mt-2 flex flex-col gap-2 pl-3">
                      {link.submenu.map((sub) => (
                        <a
                          key={sub.name}
                          href={sub.href}
                          target={sub.external ? "_blank" : undefined}
                          rel={sub.external ? "noopener noreferrer" : undefined}
                          className="text-sm text-white/70 hover:text-white"
                          onClick={() => setIsOpen(false)}
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={link.href}
                  className="font-data block text-sm uppercase tracking-[0.15em] text-white/90"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}
