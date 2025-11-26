import { TeamMemberForm } from "@/components/team-member-form"

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add Team Member</h1>
        <p className="text-gray-500 mt-1">Add a new executive board member or country representative</p>
      </div>
      <TeamMemberForm />
    </div>
  )
}
