import { createClient } from "@/lib/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Mail, Linkedin, Instagram } from "lucide-react"
import Link from "next/link"
import { DeleteTeamMemberButton } from "@/components/delete-team-member-button"
import { redirect } from "next/navigation"
import { hasPermission } from "@/lib/permissions"

export default async function TeamPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  if (!hasPermission(profile?.role, "team", "view")) {
    redirect("/dashboard")
  }

  const { data: executiveBoard } = await supabase
    .from("team_members")
    .select("*")
    .eq("section", "executive_board")
    .order("display_order", { ascending: true })

  const { data: countryReps } = await supabase
    .from("team_members")
    .select("*")
    .eq("section", "country_representatives")
    .order("display_order", { ascending: true })

  const { data: collaborators } = await supabase
    .from("collaborator_images")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Manage executive board, country representatives, and collaborators</p>
        </div>
        <Link href="/dashboard/team/new">
          <Button className="bg-[#193fa6] hover:bg-[#2563eb]" size="sm">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Member</span>
          </Button>
        </Link>
      </div>

      {/* Executive Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Executive Board</h2>
          <Badge variant="secondary">{executiveBoard?.length || 0} members</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {executiveBoard && executiveBoard.length > 0 ? (
            executiveBoard.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar_url || "/placeholder.svg"} alt={member.full_name} />
                      <AvatarFallback className="bg-[#193fa6] text-white text-lg">
                        {member.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">{member.full_name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{member.position}</p>
                      {member.country && (
                        <Badge variant="outline" className="mt-2">
                          {member.country}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {member.bio && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{member.bio}</p>}
                  <div className="flex items-center gap-2 mb-4">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-gray-600 hover:text-[#193fa6]">
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#193fa6]"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.instagram_url && (
                      <a
                        href={member.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#193fa6]"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/team/${member.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteTeamMemberButton memberId={member.id} />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500">No executive board members yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Country Representatives */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Country Representatives</h2>
          <Badge variant="secondary">{countryReps?.length || 0} members</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {countryReps && countryReps.length > 0 ? (
            countryReps.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar_url || "/placeholder.svg"} alt={member.full_name} />
                      <AvatarFallback className="bg-[#193fa6] text-white text-lg">
                        {member.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">{member.full_name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{member.position}</p>
                      {member.country && (
                        <Badge variant="outline" className="mt-2">
                          {member.country}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {member.bio && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{member.bio}</p>}
                  <div className="flex items-center gap-2 mb-4">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-gray-600 hover:text-[#193fa6]">
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#193fa6]"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.instagram_url && (
                      <a
                        href={member.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#193fa6]"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/team/${member.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteTeamMemberButton memberId={member.id} />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500">No country representatives yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Collaborators - Home Page Images */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Collaborators</h2>
            <p className="text-sm text-gray-500 mt-1">Manage collaborator images shown on the home page</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Badge variant="secondary">{collaborators?.length || 0} images</Badge>
            <Link href="/dashboard/team/collaborators/new">
              <Button className="bg-[#193fa6] hover:bg-[#2563eb]" size="sm">
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Image</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {collaborators && collaborators.length > 0 ? (
            collaborators.map((collaborator: any) => (
              <Card key={collaborator.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={collaborator.image_url || "/placeholder.svg"} 
                    alt={collaborator.alt_text || "Collaborator"} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  {collaborator.alt_text && (
                    <p className="text-xs text-gray-600 mb-2 truncate">{collaborator.alt_text}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/team/collaborators/${collaborator.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent text-xs">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteTeamMemberButton memberId={collaborator.id} isCollaborator={true} />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500">No collaborator images yet. Add images to display on the home page.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
