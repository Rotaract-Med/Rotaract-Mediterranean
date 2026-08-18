"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/client"

export interface EventsSubmenuItem {
  id: string
  title: string
  url: string
  display_order: number
  is_active: boolean
}

export interface MedshopProject {
  id: string
  title: string
  url: string
  display_order: number
  is_active: boolean
}

// Shared by Navbar and HomeNav — fetches the two dynamic dropdown sources
// (Events submenu, MedShop project links) that live in Supabase. Extracted
// from components/navbar.tsx so the home page's own nav can reuse it without
// duplicating (and risking drift from) the fetch logic.
export function useNavMenu() {
  const [eventsSubmenu, setEventsSubmenu] = useState<EventsSubmenuItem[]>([])
  const [medshopProjects, setMedshopProjects] = useState<MedshopProject[]>([])

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

    const fetchMedshopProjects = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("medshop_projects")
        .select("*")
        .eq("is_active", true)
        .order("display_order")

      if (!error && data) {
        setMedshopProjects(data)
      }
    }

    fetchMedshopProjects()
  }, [])

  return { eventsSubmenu, medshopProjects }
}
