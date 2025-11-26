import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Required for MinIO
})

const bucketName = process.env.S3_BUCKET_NAME!

export interface UploadResult {
  url: string
  key: string
  bucket: string
}

/**
 * Upload a file to S3/MinIO
 */
export async function uploadToS3(
  file: Buffer | Uint8Array,
  key: string,
  contentType: string
): Promise<UploadResult> {
  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
        ACL: "public-read", // Make files publicly accessible
      },
    })

    await upload.done()

    const publicUrl = `${process.env.S3_PUBLIC_URL}/${bucketName}/${key}`

    return {
      url: publicUrl,
      key,
      bucket: bucketName,
    }
  } catch (error) {
    console.error("Error uploading to S3:", error)
    throw new Error("Failed to upload file to S3")
  }
}

/**
 * Delete a file from S3/MinIO
 */
export async function deleteFromS3(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    await s3Client.send(command)
  } catch (error) {
    console.error("Error deleting from S3:", error)
    throw new Error("Failed to delete file from S3")
  }
}

/**
 * Generate a unique file key based on folder structure
 */
export function generateS3Key(fileName: string, folder: "media" | "videos" | "documents" = "media"): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = fileName.split(".").pop()
  const sanitizedName = fileName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/\s+/g, "_")
    .toLowerCase()

  return `${folder}/${timestamp}-${randomString}-${sanitizedName}`
}

/**
 * Convert base64 data URI to Buffer
 */
export function dataURItoBuffer(dataURI: string): { buffer: Buffer; contentType: string } {
  // Check if input is valid
  if (!dataURI || typeof dataURI !== "string") {
    throw new Error("Invalid data URI: input must be a non-empty string")
  }

  // Use a simpler regex to avoid stack overflow with large strings
  const parts = dataURI.split(",")
  if (parts.length !== 2) {
    throw new Error("Invalid data URI format: must contain exactly one comma")
  }

  const header = parts[0]
  const base64Data = parts[1]

  // Extract content type from header (data:image/png;base64)
  const contentTypeMatch = header.match(/^data:([^;]+)/)
  if (!contentTypeMatch) {
    throw new Error("Invalid data URI: missing content type")
  }

  const contentType = contentTypeMatch[1]
  
  // Verify it's base64 encoded
  if (!header.includes("base64")) {
    throw new Error("Invalid data URI: must be base64 encoded")
  }

  const buffer = Buffer.from(base64Data, "base64")

  return { buffer, contentType }
}

/**
 * Get file from S3/MinIO
 */
export async function getFromS3(key: string): Promise<Buffer> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    const response = await s3Client.send(command)
    const stream = response.Body as any
    const chunks: Uint8Array[] = []

    for await (const chunk of stream) {
      chunks.push(chunk)
    }

    return Buffer.concat(chunks)
  } catch (error) {
    console.error("Error getting from S3:", error)
    throw new Error("Failed to get file from S3")
  }
}
