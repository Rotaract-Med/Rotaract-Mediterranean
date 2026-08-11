import { createClient } from "@/lib/server"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, ImageIcon, FileText } from "lucide-react"
import { MediaUploadDialog } from "@/components/media-upload-dialog"
import { DirectS3UploadDialog } from "@/components/direct-s3-upload-dialog"
import { BulkMediaUploadDialog } from "@/components/bulk-media-upload-dialog"
import { MediaLibraryGrid } from "@/components/media-library-grid"
import { GuidelinesInfoDialog } from "@/components/guidelines-info-dialog"
import { redirect } from "next/navigation"
import { hasPermission } from "@/lib/permissions"

export default async function MediaPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  if (!hasPermission(profile?.role, "media", "view")) {
    redirect("/dashboard")
  }

  const { data: mediaFiles, error } = await supabase
    .from("media_library")
    .select("*")
    .order("created_at", { ascending: false })

  console.log("[v0] Media fetch result:", { mediaFiles, error, count: mediaFiles?.length })

  const imageFiles = mediaFiles?.filter((file) => file.file_type.startsWith("image/")) || []
  const documentFiles = mediaFiles?.filter((file) => !file.file_type.startsWith("image/")) || []

  const canUpload = hasPermission(profile?.role, "media", "create")
  const canDelete = hasPermission(profile?.role, "media", "delete")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Manage images and files for your website</p>
        </div>
        {canUpload && (
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <div className="flex gap-2">
              <MediaUploadDialog />
              <DirectS3UploadDialog />
              <BulkMediaUploadDialog />
            </div>
            <GuidelinesInfoDialog />
          </div>
        )}
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading media: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ImageIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{imageFiles.length}</p>
                <p className="text-sm text-gray-500">Images</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{documentFiles.length}</p>
                <p className="text-sm text-gray-500">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mediaFiles?.length || 0}</p>
                <p className="text-sm text-gray-500">Total Files</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MediaLibraryGrid imageFiles={imageFiles} documentFiles={documentFiles} canDelete={canDelete} />
    </div>
  )
}
