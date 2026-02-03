import Image from "next/image"

export function ComingSoonPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#193fa6] via-[#2563eb] to-[#60a5fa]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl animate-pulse delay-500" />
        
        {/* Animated Clouds */}
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
        <div className="cloud cloud-4" />
        <div className="cloud cloud-5" />
        
        {/* Flying Birds */}
        <svg className="bird bird-1" width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 15C5 15 10 5 20 5C30 5 35 15 35 15M20 5V15" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        </svg>
        <svg className="bird bird-2" width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 15C5 15 10 5 20 5C30 5 35 15 35 15M20 5V15" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
        </svg>
        <svg className="bird bird-3" width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 15C5 15 10 5 20 5C30 5 35 15 35 15M20 5V15" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Rotaract Logo */}
        <div className="mb-12 animate-fade-in">
          <Image
            src="/images/blue.png"
            alt="Rotaract Mediterranean"
            width={250}
            height={250}
            className="drop-shadow-2xl invert"
            priority
          />
        </div>

        {/* Coming Soon Text */}
        <div className="space-y-6 animate-fade-in-up">
          <h1 className="text-6xl font-bold tracking-wider text-white drop-shadow-lg sm:text-7xl md:text-8xl lg:text-9xl">
            COMING SOON
          </h1>
          
          <div className="mx-auto h-1 w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          
          <p className="mx-auto max-w-2xl text-xl text-white/90 drop-shadow-md sm:text-2xl md:text-3xl">
            New experiences from the Mediterranean await
          </p>
        </div>

        {/* Decorative line */}
        <div className="mt-16 flex items-center gap-4 text-white/70">
          <div className="h-px w-12 bg-white/50" />
          <span className="text-sm tracking-widest">ROTARACT MEDITERRANEAN</span>
          <div className="h-px w-12 bg-white/50" />
        </div>
      </div>
    </div>
  )
}
