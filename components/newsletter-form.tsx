"use client"

import type React from "react"

import { useState } from "react"

export function NewsletterForm() {
  const [email, setEmail] = useState("")

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Thank you for subscribing with ${email}!`)
    setEmail("")
  }

  return (
    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        required
        className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
      />
      <button
        type="submit"
        className="px-8 py-4 bg-white text-[#193fa6] font-semibold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 whitespace-nowrap"
      >
        Subscribe Now
      </button>
    </form>
  )
}
