import type React from "react"
import type { Metadata } from "next"
import { Inter, Archivo, Space_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

// Home-page-only display and data faces (see future-plan/typography-site-wide.md
// for the plan to roll these out site-wide later). Loaded globally here so the
// variable CSS vars are available, but only the home page's components apply
// the `font-display` / `font-data` Tailwind utilities.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

export const metadata: Metadata = {
  title: "Rotaract Mediterranean",
  description: "Connecting Europe, Middle East & Africa through international service projects and events",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} ${archivo.variable} ${spaceMono.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
