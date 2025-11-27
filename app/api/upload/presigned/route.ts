import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

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

    const { fileName, fileType } = await request.json()

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Determine folder based on file type
    let folder: "media" | "videos" | "documents" = "media"
    if (fileType.startsWith("video/")) {
      folder = "videos"
    } else if (fileType.startsWith("application/")) {
      folder = "documents"
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
