import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { ComingSoonPage } from "@/components/coming-soon-page"

// Cache this page for 30 seconds, then revalidate in background
export const revalidate = 30

export default async function MedshopPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from("medshop_settings")
    .select("mode, redirect_url")
    .single()

  if (settings?.mode === "redirect" && settings.redirect_url) {
    redirect(settings.redirect_url)
  }

  return <ComingSoonPage />
}
