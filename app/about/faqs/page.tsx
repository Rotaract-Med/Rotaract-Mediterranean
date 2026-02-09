"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

interface FAQItem {
  question: string
  answer: string | string[]
}

interface FAQCategory {
  title: string
  items: FAQItem[]
  hasImage?: boolean
}

export default function FAQsPage() {
  const [openCategory, setOpenCategory] = useState<number | null>(0)
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  const faqCategories: FAQCategory[] = [
    {
      title: "What is an MDIO?",
      hasImage: true,
      items: [
        {
          question: "What does MDIO stand for?",
          answer: "The letters M.D.I.O. stand for Multi-District Information Organisation. They are a formal structure, recognized by Rotary International, for the purpose of facilitating communication between Rotaract clubs in the districts forming this M.D.I.O. The M.D.I.O. has no decision making or legislative powers over the Rotary or Rotaract organisation, except for decisions concerning the activities of the M.D.I.O itself. There are 23 MDIOs around the world and they are shown in this map:",
        },
      ],
    },
    {
      title: "What is the Rotaract Mediterranean MDIO?",
      items: [
        {
          question: "What is the purpose of the Rotaract Mediterranean MDIO?",
          answer: "The main purpose of the Rotaract Mediterranean MDIO is to develop international relationships and foster cultural exchange between Rotaract clubs and districts from its member Districts and countries in Europe, Middle East and Africa, all over the Mediterranean region.",
        },
        {
          question: "What are the goals?",
          answer: "With the goal to unite and support rotaractors in their service and devotion in achieving better and more sustainable future for all, Rotaract Mediterranean supports the Sustainable Development Goals of the UN which address the global challenges we face, including those related to poverty, inequality, climate, environmental degradation, prosperity, and peace and justice.",
        },
  
      ],
    },
    {
      title: "How many districts are there inside?",
      items: [
        {
          question: "Which districts are part of the Rotaract Mediterranean MDIO?",
          answer: [
            "The Rotaract Mediterranean MDIO is composed by the following 26 Districts: 0055, 1510, 1660, 1690, 1700, 1720, 1730, 1750, 1760, 1770, 1790, 1910, 1912, 1913, 2032, 2041, 2060, 2071, 2072, 2080, 2090, 2100, 2110, 2120, 2201, 2202, 2203, 2420, 2430, 2440, 2451, 2452, 2470, 2483, 2484 and 9010.",
          ],
        },
        {
          question: "Which countries are represented?",
          answer: [
            "The Rotaract Mediterranean MDIO is composed by the following 18 countries:Albania, Algeria, Bosnia and Herzegovina, Croatia, Cyprus, Egypt, France, Greece, Italy, Lebanon, Malta, Monaco, Montenegro, Morocco, Slovenia, Spain, Tunisia and Turkey.",
          ],
        },
      ],
    },
    {
      title: "Can any district join?",
      items: [
        {
          question: "What are the requirements to join?",
          answer: [
            "As stated in articles 3.1 and 3.2 guidelines:",
            "The Districts eligible to be part of Rotaract Mediterranean MDIO are:",
            "- The Mediterranean Districts recognised by Rotary International along the Mediterranean Sea coastline.",
            "- The non-Mediterranean Districts recognised by Rotary International located in a Mediterranean Country.",
          ],
        },
        {
          question: "How can a district apply?",
          answer: "Districts compiling with the previous description who have the support of the rotaract clubs in their district and the CRs will be considered as ordinary members. Districts that do not fully comply with the requirements above, such as non-Mediterranean countries inside member districts, might be admitted to the Rotaract Mediterranean MDIO as honorary members (non-voting members).",
        },
        {
          question: "Is there any fee to join?",
          answer: "Districts are NOT required to pay any fee when entering the MDIO.",
        },
      ],
    },
    {
      title: "How is the internal coordination?",
      items: [
        {
          question: "Who coordinates the MDIO?",
          answer: [
            "The coordination of the MDIO is done by the Executive Board and the Country Representatives.",
            "",
            "The Executive Board is the main decision maker of activities done by the Rotaract Mediterranean MDIO and the tools to be used to disseminate information and manage events since it represents the entire participating Districts. The Rotaract Mediterranean MDIO Executive Board (Article 53), shall also vote together with the Country Representatives on all the decisions that are to be made.",
            "",
            "The Rotaract Mediterranean MDIO Board of Country Representatives monitors and supervises all activities and divisions, and it must take all necessary actions as outlined in the organisation's bylaws to accomplish the tasks and the objectives of the Rotaract Mediterranean MDIO.",
          ],
        },
      ],
    },
  ]

  const toggleCategory = (index: number) => {
    setOpenCategory(openCategory === index ? null : index)
    setOpenQuestion(null)
  }

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenQuestion(openQuestion === key ? null : key)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navbar variant="light" />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 mb-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-[#193fa6] mb-6">
              FAQs
            </h1>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
            <p className="text-xl text-gray-700">
              Find answers to commonly asked questions about the Rotaract Mediterranean MDIO
            </p>
          </div>
        </div>

        {/* FAQ Accordion */
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-4">
              {faqCategories.map((category, categoryIndex) => (
                <div
                  key={categoryIndex}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(categoryIndex)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left bg-gradient-to-r from-[#193fa6] to-blue-600 hover:from-[#1a4bc4] hover:to-blue-700 transition-all duration-300"
                  >
                    <h2 className="text-xl md:text-2xl font-bold text-white pr-4">
                      {category.title}
                    </h2>
                    <ChevronDown
                      className={`h-6 w-6 text-white flex-shrink-0 transition-transform duration-300 ${openCategory === categoryIndex ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {/* Category Content */}
                  <div
                    className={`transition-all duration-300 ease-in-out ${openCategory === categoryIndex
                        ? "max-h-[2000px] opacity-100"
                        : "max-h-0 opacity-0"
                      } overflow-hidden`}
                  >
                    <div className="p-6 space-y-3">
                      {category.items.map((item, questionIndex) => (
                        <div
                          key={questionIndex}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#193fa6] transition-colors duration-300"
                        >
                          {/* Question */}
                          <button
                            onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                            className="w-full px-5 py-4 flex items-start justify-between text-left bg-gray-50 hover:bg-blue-50 transition-colors duration-300"
                          >
                            <div className="flex items-start gap-3 flex-1">
                              <HelpCircle className="h-5 w-5 text-[#193fa6] flex-shrink-0 mt-0.5" />
                              <span className="text-base md:text-lg font-semibold text-gray-900">
                                {item.question}
                              </span>
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 text-[#193fa6] flex-shrink-0 ml-2 transition-transform duration-300 ${openQuestion === `${categoryIndex}-${questionIndex}`
                                  ? "rotate-180"
                                  : ""
                                }`}
                            />
                          </button>

                          {/* Answer */}
                          <div
                            className={`transition-all duration-300 ease-in-out ${openQuestion === `${categoryIndex}-${questionIndex}`
                                ? "max-h-[1000px] opacity-100"
                                : "max-h-0 opacity-0"
                              } overflow-hidden`}
                          >
                            <div className="px-5 py-4 bg-white">
                              {Array.isArray(item.answer) ? (
                                <div className="space-y-2">
                                  {item.answer.map((line, idx) => (
                                    <p key={idx} className="text-gray-700 leading-relaxed">
                                      {line}
                                    </p>
                                  ))}
                                </div>
                              ) : (
                                <>
                                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                  {categoryIndex === 0 && questionIndex === 0 && (
                                    <div className="mt-6 rounded-xl overflow-hidden border border-gray-200">
                                      <div className="relative w-full aspect-[16/9]">
                                        <Image
                                          src="/images/CountriesMDIO.png"
                                          alt="MDIO Countries Map"
                                          fill
                                          className="object-contain"
                                          priority
                                        />
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      </main>

      <Footer />
    </div>
  )
}
