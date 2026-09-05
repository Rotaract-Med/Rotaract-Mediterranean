import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { MedshopProjectsManager } from "@/components/medshop-projects-manager"
import { MedshopSettingsForm } from "@/components/medshop-settings-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function MedshopProjectsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Only admins can access this page
  if (!profile || profile.role !== 'admin') {
    redirect("/dashboard")
  }

  const { data: projects } = await supabase
    .from("medshop_projects")
    .select("*")
    .order("display_order")

  const { data: medshopSettings } = await supabase
    .from("medshop_settings")
    .select("*")
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">MedShop</h1>
        <p className="text-gray-600 mt-2">
          Control the /medshop page and the project links in its dropdown menu
        </p>
      </div>

      <Tabs defaultValue="page-settings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="page-settings">Page Settings</TabsTrigger>
          <TabsTrigger value="dropdown-projects">Dropdown Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="page-settings">
          {medshopSettings && <MedshopSettingsForm settings={medshopSettings} />}
        </TabsContent>

        <TabsContent value="dropdown-projects">
          <MedshopProjectsManager initialItems={projects || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
