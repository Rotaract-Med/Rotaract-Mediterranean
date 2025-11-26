import { createClient } from "@/lib/server"
import { AwardsPageClient } from "@/components/awards-page-client"

export const metadata = {
  title: "Awards & Recognition | Rotaract Mediterranean",
  description: "Celebrating excellence and achievements across the Mediterranean region",
}

export default async function AwardsPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase.from("awards_settings").select("*").single()

  return <AwardsPageClient settings={settings} />
}
