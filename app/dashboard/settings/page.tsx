import { createClient } from "@/lib/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/user-management"
import { ProfileSettings } from "@/components/profile-settings"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="profile" className="flex-1 sm:flex-none">Profile</TabsTrigger>
          {profile?.role === "admin" && <TabsTrigger value="users" className="flex-1 sm:flex-none">User Management</TabsTrigger>}
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings user={user} profile={profile} />
        </TabsContent>

        {profile?.role === "admin" && (
          <TabsContent value="users">
            <UserManagement currentUserId={user?.id} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
