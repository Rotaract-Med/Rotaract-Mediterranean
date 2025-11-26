import { Mail, MapPin, Instagram, Facebook, Twitter, } from "lucide-react"
import { FaTiktok } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="bg-[#193fa6] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="mb-4">
              <img 
                src="/images/Blue.png" 
                alt="Mediterranean Rotaract" 
                className="h-48 w-auto brightness-0 invert -my-20"
              />
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              In 2013, Rotaract Mediterranean MDIO was officially recognized by Rotary-International as a Multi-district Information Organisation thus becoming one of the key international MDIOS in the Rotary world.
            </p>
            
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about/guidelines-resources" className="hover:text-blue-200 transition-colors">
                  Guidelines & Resources
                </a>
              </li>
              <li>
                <a href="#initiatives" className="hover:text-blue-200 transition-colors">
                  Project Initiatives
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition-colors">
                  Rotaract Mediterranean Directory
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-200 transition-colors">
                  Reach Out
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Mail size={16} className="mt-1 opacity-75" />
                <div>
                  <div>rotaractmediterranean@gmail.com</div>
                  <div className="text-xs opacity-75">General Secretary</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1 opacity-75" />
                <div>
                  <div>Mediterranean Regional Office</div>
                  <div className="text-xs opacity-75">78, avenue des Champs Elysées, Bureau 562, 75008, Paris</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <p className="text-sm opacity-90 mb-4">
              Stay connected with us on social media for updates, stories, and community engagement.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://instagram.com/rotaractmediterranean"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer hover:scale-110"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com/rotaractmediterranean"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer hover:scale-110"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com/rotaractmed"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer hover:scale-110"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://tiktok.com/@rotaractmediterranean"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on TikTok"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer hover:scale-110"
              >
                <FaTiktok size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
