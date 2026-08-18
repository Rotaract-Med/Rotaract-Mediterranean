// Narrative content for the home page's scroll story.
// All copy is lifted verbatim (or lightly corrected for typos) from the existing
// About pages and Awards page — nothing here is invented. See:
//   app/about/who-we-are/page.tsx
//   app/about/our-history/page.tsx
//   app/about/districts-countries/page.tsx
//   app/about/faqs/page.tsx
//   components/awards-page-client.tsx

export interface NetworkStat {
  end: number
  suffix?: string
  label: string
}

// The org-wide network numbers. Home previously showed "26 Districts" while every
// About page and the FAQ says 39 — using the correct, consistent figure here.
export const networkStats: NetworkStat[] = [
  { end: 3, label: "Continents" },
  { end: 18, label: "Countries" },
  { end: 39, label: "Districts" },
  { end: 1000, suffix: "+", label: "Clubs" },
  { end: 15007, suffix: "+", label: "Rotaractors" },
]

export interface OriginEvent {
  date: string
  title: string
  place: string
  description: string
  image: string | null
}

// The founding story, chronological (this is how it actually happened — the idea
// traveled back and forth across the sea between Morocco, Lebanon and Italy
// before Rotary recognized the MDIO). Verbatim from app/about/our-history/page.tsx.
export const originEvents: OriginEvent[] = [
  {
    date: "JULY 1ST, 2012",
    title: "THE IDEA WAS BORN",
    place: "MOROCCO · D9010",
    description:
      "The initiative of gathering all the Mediterranean Rotaract Districts started in 2012, when the District Rotaract Representative of District 9010 in Morocco, Housni Sbai Idrissi, contacted the DRR of Lebanon and a Past DRR of Italy. The idea was greatly encouraged by Past DRR Belal Ayoubi, DRR of District 2450 (now 2451 and 2452), who started working on the foundation along with District 2450 International Coordinator, Vera Damerjian.",
    image: "/images/history-map.jpg",
  },
  {
    date: "SEPTEMBER 20TH, 2012",
    title: "MEANWHILE…",
    place: "ITALY · D2110",
    description:
      "…a similar initiative had already been present within the Italian District 2110, and attempts of cooperating with Mediterranean Districts were being encouraged by Past DRR Francesco de Francesco and District Governor Francesco Socievole, namely through the project 'Laboratories of Peace' which aimed at creating a Mediterranean network of schools.",
    image: null,
  },
  {
    date: "NOVEMBER 15TH, 2012",
    title: "MEDITERRANEAN UNITY",
    place: "ASIA · AFRICA · EUROPE",
    description:
      "Uniting Rotary Districts around the Mediterranean Sea was warmly welcomed from the shores of Asia, Africa and Europe, thereby paving the way to place the milestone for one massive project, the Rotaract Mediterranean Multi-District Information Organization.",
    image: null,
  },
  {
    date: "DECEMBER 13TH, 2012",
    title: "1ST MED PEACE FORUM",
    place: "POMPEII, ITALY",
    description:
      "The initial step towards reality, of a dream coming true, has been indeed taken during the first edition of the Mediterranean Peace Forum which took place in December 2012 in Pompeii, Italy. This event was a very essential occasion for the founding leaders to meet in person, and for the Med MDIO to be initiated together with the presence and the support of Mr. Wilfrid Wilkinson, Past President of the Rotary Foundation.",
    image: "/images/italy.png",
  },
  {
    date: "FEBRUARY 13TH, 2013",
    title: "ROTARY RECOGNITION",
    place: "D2100 · D9010 · D2202 · D2450",
    description:
      "As a result of all the efforts, Rotary International officially recognized the Med MDIO on the 13th of February, 2013, with its first four districts: 2100, 9010, 2202, and 2450 (now 2451 and 2452).",
    image: "/images/recognition.jpeg",
  },
  {
    date: "APRIL 26TH, 2013",
    title: "1ST MEDICON",
    place: "MARRAKECH, MOROCCO",
    description:
      "The first edition of the MEDICON was organized in April 2013 in Marrakech, Morocco, District 9010. Today, this very special event, the 'Mediterranean Peace Forum' has been included in the Mediterranean Conference (also known as MEDICON) which takes place annually each Spring to gather the Med MDIO team members, all Mediterranean Rotarians and Rotaractors, as well as Rotary family members from all around the world.",
    image: "/images/Marrakech-full.png",
  },
]

export interface Initiative {
  slug: "medlove" | "mednature" | "medculture"
  name: string
  tagline: string
  description: string
  color: string
  colorDark: string
  /** UN Sustainable Development Goal numbers this initiative aligns with. */
  sdgs: number[]
}

/** Path to a Global Goals color icon already bundled under public/images/SDGs. */
export function sdgIconPath(n: number): string {
  return `/images/SDGs/goal-${n}/GOAL_${n}_PRIMARY_ICON/GOAL_${n}_PNG/TheGlobalGoals_Icons_Color_Goal_${n}.png`
}

// Verbatim from components/home-page-client.tsx + app/med{love,nature,culture}/page.tsx
export const initiatives: Initiative[] = [
  {
    slug: "medlove",
    name: "medLOVE",
    tagline: "Promoting social inclusion and community welfare",
    description:
      "medLOVE serves as a versatile and multidisciplinary social effort to strengthen vulnerable social groups at the Mediterranean region. It shall overcome the discrimination towards minorities and evolve into a powerful message of LOVE, a high value across the Mediterranean.",
    color: "#e91e63",
    colorDark: "#8f1140",
    sdgs: [1, 2, 3, 4, 6, 10],
  },
  {
    slug: "mednature",
    name: "medNATURE",
    tagline: "Environmental sustainability and conservation",
    description:
      "medNATURE is a Rotaract Mediterranean MDIO project initiative which serves as a versatile and multidisciplinary social effort to preserve the nature in the Mediterranean Sea ecosystem, raise awareness and promote eco-friendly mindset and actions.",
    color: "#10B981",
    colorDark: "#065f46",
    sdgs: [7, 12, 13, 14, 15],
  },
  {
    slug: "medculture",
    name: "medCULTURE",
    tagline: "Cultural exchange and heritage preservation",
    description:
      "medCULTURE exists to preserve cultural heritage and promote unity in diversity. The aim is to protect cultural heritage and learn about other member countries through exchange projects and twinning, with promotion of the member countries' UNESCO world heritage highly encouraged.",
    color: "#38bdf8",
    colorDark: "#0c4a6e",
    sdgs: [16, 17],
  },
]

export interface AwardCategory {
  name: string
  description: string
  image: string
  color: string
}

// Verbatim from components/awards-page-client.tsx:636-685
export const awardCategories: AwardCategory[] = [
  { name: "MedLove", description: "Celebrating projects that support vulnerable communities, reduce discrimination, and spread love.", image: "/images/awards/love.png", color: "#FF69B4" },
  { name: "MedNature", description: "Honoring initiatives that protect the ecosystem, raise awareness, and promote eco-friendly mindsets and sustainable actions.", image: "/images/awards/nature.png", color: "#10B981" },
  { name: "MedCulture", description: "Highlighting projects that preserve cultural heritage, promote unity in diversity, and encourage cultural exchange.", image: "/images/awards/culture.png", color: "#fb8a4f" },
  { name: "MedPeace", description: "Acknowledging efforts that promote peace, diversity, equity, and inclusion.", image: "/images/awards/peace.png", color: "#3B82F6" },
  { name: "MedTwinning", description: "Celebrating successful partnerships and collaborations between Rotaract clubs in the Mediterranean.", image: "/images/awards/twinning.png", color: "#945093" },
  { name: "MedExcellence", description: "Recognizing outstanding clubs that actively participated in MED initiatives and events, demonstrating strong engagement and commitment.", image: "/images/awards/excellence.png", color: "#004aad" },
]

// components/home-page-client.tsx original copy, "accross" typo corrected.
export const movementCopy =
  "With the goal to unite and support rotaractors in their service and devotion in achieving a better and more sustainable future for all, Rotaract Mediterranean carries 3 initiatives as a general movement across the Mediterranean: medLOVE, medNATURE & medCULTURE. Through this wave across the Mediterranean, the Rotaract Mediterranean MDIO supports the Sustainable Development Goals set by the United Nations."

export const directoryCopy =
  "We gathered club information from every member district and country to make club twinnings and international collaboration projects easier for you. Don't hesitate to reach out to clubs from your neighbour country — or continent."
