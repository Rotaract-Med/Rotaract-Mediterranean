import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { deleteFromS3 } from "@/lib/s3"

// Folders a caller may explicitly request, beyond the default type-based
// inference below. "pdf-pages" holds rendered PDF import pages (see
// lib/pdf-parser.ts) - kept in their own prefix specifically so the DELETE
// handler here can safely allow journalists to clean up a superseded
// import without giving them a generic "delete any S3 object" capability.
const ALLOWED_EXPLICIT_FOLDERS = ["media", "videos", "documents", "pdf-pages"] as const
type ExplicitFolder = (typeof ALLOWED_EXPLICIT_FOLDERS)[number]

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
})

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
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || !["admin", "media_team", "journalist"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { fileName, fileType, folder: requestedFolder } = await request.json()

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (requestedFolder !== undefined && !ALLOWED_EXPLICIT_FOLDERS.includes(requestedFolder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 })
    }

    // Determine folder: explicit request wins, otherwise infer from file type
    let folder: ExplicitFolder = requestedFolder ?? "media"
    if (requestedFolder === undefined) {
      if (fileType.startsWith("video/")) {
        folder = "videos"
      } else if (fileType.startsWith("application/")) {
        folder = "documents"
      }
    }

    // Generate unique S3 key
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
    const key = `${folder}/${timestamp}-${sanitizedFileName}`

    // Generate presigned URL for direct upload (expires in 10 minutes)
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
      ACL: "public-read",
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600, // 10 minutes
    })

    const publicUrl = `${process.env.S3_PUBLIC_URL}/${process.env.S3_BUCKET_NAME}/${key}`

    return NextResponse.json({
      presignedUrl,
      publicUrl,
      key,
    })
  } catch (error: any) {
    console.error("Presigned URL error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate upload URL" },
      { status: 500 }
    )
  }
}

// Cleans up PDF import page renders that a newer import (or a cancelled
// edit) has superseded - see components/article-form.tsx. Deliberately
// restricted to the pdf-pages/ prefix: these files never get a
// media_library row (that's the whole point, see 029_allow_journalist_media_upload.sql's
// comment), so there's no ownership record to check against. Scoping by
// prefix keeps this from becoming a "delete any S3 object by key"
// endpoint for a role that doesn't otherwise have delete access to media.
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || !["admin", "media_team", "journalist"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { urls } = await request.json()
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "No URLs provided" }, { status: 400 })
    }

    const urlPrefix = `${process.env.S3_PUBLIC_URL}/${process.env.S3_BUCKET_NAME}/`
    const keys = urls.map((url: unknown) => {
      if (typeof url !== "string" || !url.startsWith(urlPrefix)) return null
      return url.slice(urlPrefix.length)
    })

    if (keys.some((key) => !key || !key.startsWith("pdf-pages/"))) {
      return NextResponse.json({ error: "Only pdf-pages/ files can be deleted through this endpoint" }, { status: 400 })
    }

    await Promise.all(
      (keys as string[]).map((key) =>
        deleteFromS3(key).catch((err) => console.error("Failed to delete superseded PDF page:", key, err)),
      ),
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete superseded PDF pages error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete files" }, { status: 500 })
  }
}
