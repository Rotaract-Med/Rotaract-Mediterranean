import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"
import { deleteFromS3 } from "@/lib/s3"

export async function POST(request: NextRequest) {
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

    const { ids } = await request.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No files selected" }, { status: 400 })
    }

    // Get the media file details first to get the S3 keys
    const { data: mediaFiles, error: fetchError } = await supabase
      .from("media_library")
      .select("id, s3_key")
      .in("id", ids)

    if (fetchError) {
      console.error("Fetch error:", fetchError)
      return NextResponse.json({ error: "Failed to look up media files" }, { status: 500 })
    }

    // Delete from S3 (best-effort - continue with DB deletion even if some fail)
    await Promise.allSettled(
      (mediaFiles || [])
        .filter((file) => file.s3_key)
        .map((file) => deleteFromS3(file.s3_key))
    )

    // Delete from database
    const { error: deleteError } = await supabase.from("media_library").delete().in("id", ids)

    if (deleteError) {
      console.error("Database delete error:", deleteError)
      return NextResponse.json({ error: "Failed to delete from database" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      deleted: mediaFiles?.length || 0,
    })
  } catch (error: any) {
    console.error("Bulk delete error:", error)
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 })
  }
}
