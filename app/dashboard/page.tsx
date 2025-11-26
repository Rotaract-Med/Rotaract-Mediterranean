import { createClient } from "@/lib/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, ImageIcon, TrendingUp } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // Get statistics
  const { count: articlesCount } = await supabase.from("articles").select("*", { count: "exact", head: true })

  const { count: teamCount } = await supabase.from("team_members").select("*", { count: "exact", head: true })

  const { count: mediaCount } = await supabase.from("media_library").select("*", { count: "exact", head: true })

  const stats = [
    {
      title: "Total Articles",
      value: articlesCount || 0,
      icon: FileText,
      description: "Published and draft articles",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Team Members",
      value: teamCount || 0,
      icon: Users,
      description: "Executive board & representatives",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Media Files",
      value: mediaCount || 0,
      icon: ImageIcon,
      description: "Images and documents",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Active Users",
      value: 1,
      icon: TrendingUp,
      description: "Currently online",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name || "User"}!</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Here's what's happening with your organization today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="aspect-square lg:aspect-auto">
              <CardContent className="h-full flex flex-col items-center justify-center p-4 lg:p-6">
                <div className={`p-3 rounded-lg ${stat.bgColor} mb-3`}>
                  <Icon className={`h-6 w-6 lg:h-8 lg:w-8 ${stat.color}`} />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <p className="text-xs font-medium text-gray-600 text-center mb-1 lg:hidden">{stat.title}</p>
                <p className="text-xs text-gray-500 text-center hidden lg:block">{stat.title}</p>
                <p className="text-xs text-gray-500 text-center hidden lg:block">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks based on your role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 lg:grid-cols-3 gap-3 lg:gap-4">
            {(profile?.role === "journalist" || profile?.role === "admin") && (
              <a
                href="/dashboard/articles/new"
                className="aspect-square lg:aspect-auto p-4 border border-gray-200 rounded-lg hover:border-[#193fa6] hover:bg-gray-50 transition-colors flex flex-col items-center justify-center lg:items-start lg:justify-start"
              >
                <FileText className="h-8 w-8 lg:h-8 lg:w-8 text-[#193fa6] mb-0 lg:mb-2" />
                <h3 className="font-semibold text-gray-900 text-xs lg:text-base text-center lg:text-left mt-2 lg:mt-0">Create Article</h3>
                <p className="text-sm text-gray-500 mt-1 hidden lg:block">Write a new MEDTimes article</p>
              </a>
            )}
            {profile?.role === "admin" && (
              <a
                href="/dashboard/team/new"
                className="aspect-square lg:aspect-auto p-4 border border-gray-200 rounded-lg hover:border-[#193fa6] hover:bg-gray-50 transition-colors flex flex-col items-center justify-center lg:items-start lg:justify-start"
              >
                <Users className="h-8 w-8 lg:h-8 lg:w-8 text-[#193fa6] mb-0 lg:mb-2" />
                <h3 className="font-semibold text-gray-900 text-xs lg:text-base text-center lg:text-left mt-2 lg:mt-0">Add Team Member</h3>
                <p className="text-sm text-gray-500 mt-1 hidden lg:block">Add new board or representative</p>
              </a>
            )}
            {(profile?.role === "media_team" || profile?.role === "admin") && (
              <a
                href="/dashboard/media"
                className="aspect-square lg:aspect-auto p-4 border border-gray-200 rounded-lg hover:border-[#193fa6] hover:bg-gray-50 transition-colors flex flex-col items-center justify-center lg:items-start lg:justify-start"
              >
                <ImageIcon className="h-8 w-8 lg:h-8 lg:w-8 text-[#193fa6] mb-0 lg:mb-2" />
                <h3 className="font-semibold text-gray-900 text-xs lg:text-base text-center lg:text-left mt-2 lg:mt-0">Upload Media</h3>
                <p className="text-sm text-gray-500 mt-1 hidden lg:block">Add images and files</p>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
