import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"
import { uploadToS3, generateS3Key, dataURItoBuffer } from "@/lib/s3"

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

    if (!profile || !["admin", "media_team", "journalist"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { file, fileName, title, description, fileType } = body

    if (!file || !fileName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Log file info for debugging
    console.log("Upload request:", {
      fileName,
      fileType,
      fileDataLength: file?.length,
      filePrefix: file?.substring(0, 50),
    })

    // Convert base64 to buffer
    const { buffer, contentType } = dataURItoBuffer(file)

    // Determine folder based on file type
    let folder: "media" | "videos" | "documents" = "media"
    if (contentType.startsWith("video/")) {
      folder = "videos"
    } else if (contentType.startsWith("application/")) {
      folder = "documents"
    }

    // Generate S3 key and upload
    const key = generateS3Key(fileName, folder)
    const uploadResult = await uploadToS3(buffer, key, contentType)

    // Save metadata to database
    const { data: mediaFile, error: dbError } = await supabase
      .from("media_library")
      .insert({
        file_name: title || fileName,
        file_url: uploadResult.url,
        file_type: fileType || contentType,
        alt_text: description || null,
        s3_key: uploadResult.key,
        s3_url: uploadResult.url,
        file_size: buffer.length,
        uploaded_by: user.id,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save metadata" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      file: mediaFile,
      url: uploadResult.url,
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}
