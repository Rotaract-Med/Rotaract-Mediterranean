import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"
import { deleteFromS3 } from "@/lib/s3"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check user permissions
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || !["admin", "media_team"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = params

    // Get the media file details first to get the S3 key
    const { data: mediaFile, error: fetchError } = await supabase
      .from("media_library")
      .select("s3_key")
      .eq("id", id)
      .single()

    if (fetchError || !mediaFile) {
      return NextResponse.json({ error: "Media file not found" }, { status: 404 })
    }

    // Delete from S3 if s3_key exists
    if (mediaFile.s3_key) {
      try {
        await deleteFromS3(mediaFile.s3_key)
        console.log("Deleted from S3:", mediaFile.s3_key)
      } catch (s3Error) {
        console.error("Error deleting from S3:", s3Error)
        // Continue with database deletion even if S3 deletion fails
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase.from("media_library").delete().eq("id", id)

    if (deleteError) {
      console.error("Database delete error:", deleteError)
      return NextResponse.json({ error: "Failed to delete from database" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Media file deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 })
  }
}
