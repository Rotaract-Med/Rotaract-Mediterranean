import { Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react"
import { FaTiktok } from "react-icons/fa"

const social = [
  { name: "Instagram", href: "https://instagram.com/rotaractmediterranean", Icon: Instagram },
  { name: "Facebook", href: "https://facebook.com/rotaractmediterranean", Icon: Facebook },
  { name: "Twitter", href: "https://twitter.com/rotaractmed", Icon: Twitter },
  { name: "TikTok", href: "https://tiktok.com/@rotaractmediterranean", Icon: FaTiktok },
]

/**
 * The story's closing beat — same facts as the shared <Footer/> (2013 Rotary
 * recognition, contact, socials) but set in the home page's own type system
 * so the voyage doesn't end by slamming into the old template.
 */
export function HomeFooter() {
  return (
    <footer className="relative bg-[#08163d] pb-10 pt-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <img src="/images/blue.png" alt="Rotaract Mediterranean" className="mb-6 h-14 w-auto brightness-0 invert" />
          <p className="font-display max-w-md text-2xl leading-snug text-white/90">
            In 2013, Rotaract Mediterranean MDIO was recognized by Rotary International as a
            Multi-District Information Organisation — one sea, one wave, still moving.
          </p>
        </div>

        <div>
          <h3 className="font-data mb-4 text-[11px] uppercase tracking-[0.2em] text-white/50">Find your way</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><a href="/about/who-we-are" className="hover:text-white">Who we are</a></li>
            <li><a href="/awards" className="hover:text-white">The awards</a></li>
            <li><a href="/team" className="hover:text-white">The team</a></li>
            <li><a href="/about/guidelines-resources" className="hover:text-white">Guidelines & resources</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-data mb-4 text-[11px] uppercase tracking-[0.2em] text-white/50">Reach us</h3>
          <div className="space-y-4 text-sm text-white/80">
            <div className="flex items-start gap-2">
              <Mail size={15} className="mt-0.5 shrink-0 opacity-60" />
              <div>
                <a href="mailto:rotaractmediterranean@gmail.com" className="hover:text-white">rotaractmediterranean@gmail.com</a>
                <div className="text-xs opacity-60">General Secretary</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0 opacity-60" />
              <div className="text-xs opacity-70">78, avenue des Champs Elysées, Bureau 562, 75008, Paris</div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            {social.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${name}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/20"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-10">
        <div className="font-data flex flex-col gap-2 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.2em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>Rotaract Mediterranean MDIO</span>
          <span>35°N · 18°E — the Mediterranean Sea</span>
        </div>
      </div>
    </footer>
  )
}
