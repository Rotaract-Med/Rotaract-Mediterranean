import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { hasPermission } from "@/lib/permissions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CollaboratorImageForm } from "@/components/collaborator-image-form"

export default async function NewCollaboratorPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  if (!hasPermission(profile?.role, "team", "create")) {
    redirect("/dashboard")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add Collaborator Image</h1>
        <p className="text-gray-500 mt-1">Add a new collaborator image to display on the home page</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Image Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CollaboratorImageForm />
        </CardContent>
      </Card>
    </div>
  )
}
