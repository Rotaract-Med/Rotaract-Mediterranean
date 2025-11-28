"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Download, FileText, BookOpen, Scale, Megaphone, DollarSign } from "lucide-react"
import { createClient } from "@/lib/client"
import { useState, useEffect } from "react"

interface ResourceCard {
  title: string
  subtitle: string
  description: string | React.ReactNode
  icon: React.ReactNode
  fileName: string
  color: string
}

interface MediaFile {
  id: string
  file_name: string
  file_url: string
  s3_url?: string
  file_type: string
}

export default function GuidelinesResourcesPage() {
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const resources: ResourceCard[] = [
    {
      title: "Our Bylaws",
      subtitle: "BYLAWS & GUIDELINES",
      description: "The bylaws aim to give the structure on how decisions within the Mediterranean MDIO are taken regulating processes and responsibilities of its team. This version of the bylaws has been voted on in this year",
      icon: <Scale className="h-10 w-10" />,
      fileName: "Rotaract Mediterranean Bylaws",
      color: "from-blue-600 to-blue-700"
    },
    {
      title: "Official Presentation",
      subtitle: "PRESENTATION",
      description: "This is your reference for all the information you are looking for. Use it in district presentations as well as club meetings. It is available to everyone interested to know about the Rotaract Mediterranean MDIO.",
      icon: <FileText className="h-10 w-10" />,
      fileName: "Rotaract Mediterranean Official Presentation",
      color: "from-indigo-600 to-indigo-700"
    },
    {
      title: "Event Organisation Guidelines",
      subtitle: "BYLAWS & GUIDELINES",
      description: (
        <>
          These Medicon Visual Guidelines represent a new milestone in Rotaract Mediterranean history.
          <br />
          This document aims not only to show this journey but to make it in a very unified and coherent way, asking all of you to take part in this unique and valuable identity:
          <br />
          <p className="font-bold italic">One organization, one brand, one signature.</p>
        </>
      ),
      icon: <Megaphone className="h-10 w-10" />,
      fileName: "Rotaract Mediterranean Event Organisation Guidelines",
      color: "from-purple-600 to-purple-700"
    },
    {
      title: "Fundraising Guidelines",
      subtitle: "BYLAWS & GUIDELINES",
      description:(
        <>
          You may be able to pay for your projects entirely through fundraising events, such as charity dinners, walkathons, or online auctions. These events will not only help you raise money for your project but also awareness for Rotary and The Rotary Foundation.
          <br /><br />
          Learn more by downloading the presentation below!
        
        </>
      ),
      icon: <DollarSign className="h-10 w-10" />,
      fileName: "Rotaract Mediterranean Fundraising Guidelines",
      color: "from-emerald-600 to-emerald-700"
    },
    {
      title: "Brand Guidelines",
      subtitle: "BYLAWS & GUIDELINES",
      description: "In 2018, we established a very important milestone, unifying all Rotaract Mediterranean visual assets and accumulating its growth along the years. We are visually opening our brand to Rotaractors all around the globe. Download it here!",
      icon: <BookOpen className="h-10 w-10" />,
      fileName: "Rotaract Mediterranean Brand Guidelines",
      color: "from-rose-600 to-rose-700"
    }
  ]

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
      setDownloadingFile(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      <Navbar variant="light" />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-[#193fa6] mb-6">
              Guidelines & Resources
            </h1>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 leading-relaxed">
              Access essential documents, guidelines, and resources to help you better understand 
              and engage with the Rotaract Mediterranean MDIO
            </p>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-r ${resource.color} p-6 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  
                  <div className="relative flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white/90 text-sm font-semibold tracking-wide uppercase mb-2">
                        {resource.subtitle}
                      </p>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                        {resource.title}
                      </h2>
                    </div>
                    <div className="ml-4 p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <div className="text-white">
                        {resource.icon}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="text-gray-700 leading-relaxed mb-6 min-h-[120px]">
                    {resource.description}
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(resource.fileName)}
                    disabled={downloadingFile === resource.fileName || loading || !getFileForResource(resource.fileName)}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r ${resource.color} 
                      hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 
                      flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Loading...</span>
                      </>
                    ) : downloadingFile === resource.fileName ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Opening...</span>
                      </>
                    ) : !getFileForResource(resource.fileName) ? (
                      <>
                        <FileText className="h-5 w-5" />
                        <span>Not Available</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        <span>Download Latest Version</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 bg-gradient-to-r from-[#193fa6] to-blue-600 rounded-2xl shadow-xl p-8 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Need More Information?
              </h3>
              <p className="text-lg text-white/90 mb-6">
                If you have questions about any of these documents or need additional resources, 
                please don't hesitate to reach out to your District Representative or the Executive Board.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:secretary@rotaractmediterranean.com"
                  className="px-6 py-3 bg-white text-[#193fa6] rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200"
                >
                  Contact Secretary
                </a>
                <a
                  href="/team"
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-colors duration-200 border border-white/30"
                >
                  View Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
