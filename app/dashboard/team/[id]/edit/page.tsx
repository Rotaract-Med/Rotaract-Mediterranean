import { createClient } from "@/lib/server"
import { TeamMemberForm } from "@/components/team-member-form"
import { notFound } from "next/navigation"

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: member } = await supabase.from("team_members").select("*").eq("id", id).single()

  if (!member) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Team Member</h1>
        <p className="text-gray-500 mt-1">Update team member information</p>
      </div>
      <TeamMemberForm member={member} />
    </div>
  )
}
