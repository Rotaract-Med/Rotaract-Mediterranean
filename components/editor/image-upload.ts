import { createClient } from "@/lib/client"

const SMALL_FILE_LIMIT = 3 * 1024 * 1024 // 3MB - matches app/api/upload/route.ts's base64 cap
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB - matches components/pdf-s3-upload.tsx

interface UploadResult {
  url: string
  key: string
}

async function uploadDirectlyToS3(file: File, onProgress?: (pct: number) => void): Promise<UploadResult> {
  const presignResponse = await fetch("/api/upload/presigned", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileType: file.type }),
  })

  if (!presignResponse.ok) {
    const errorData = await presignResponse.json()
    throw new Error(errorData.error || "Failed to get upload URL")
  }

  const { presignedUrl, publicUrl, key } = await presignResponse.json()

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    })

    xhr.addEventListener("load", () => {
      if (xhr.status === 200 || xhr.status === 204) {
        resolve({ url: publicUrl, key })
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener("error", () => reject(new Error("Network error during upload")))

    xhr.open("PUT", presignedUrl)
    xhr.setRequestHeader("Content-Type", file.type)
    xhr.send(file)
  })
}

async function uploadSmallFile(file: File): Promise<UploadResult> {
  const dataURI = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file: dataURI, fileName: file.name, title: file.name, fileType: file.type }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to upload image")
  }

  const result = await response.json()
  return { url: result.url, key: result.file.s3_key }
}

/**
 * Uploads an image dropped/pasted/picked in the article editor to the same
 * S3 + media_library destination as the standalone media library uploads
 * (components/pdf-s3-upload.tsx, app/api/upload/route.ts), so editor images
 * show up in /dashboard/media too. Branches on size the same way those do.
 */
export async function uploadEditorImage(file: File, onProgress?: (pct: number) => void): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be inserted here")
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Image is too large. Maximum size is 100MB (yours is ${(file.size / 1024 / 1024).toFixed(1)}MB)`)
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("You must be logged in to upload images")

  let result: UploadResult
  if (file.size > SMALL_FILE_LIMIT) {
    result = await uploadDirectlyToS3(file, onProgress)
    const { error: dbError } = await supabase.from("media_library").insert({
      file_name: file.name,
      file_url: result.url,
      file_type: file.type,
      alt_text: null,
      s3_key: result.key,
      s3_url: result.url,
      file_size: file.size,
      uploaded_by: user.id,
    })
    if (dbError) {
      console.error("Failed to save media_library row for editor image:", dbError)
    }
  } else {
    onProgress?.(50)
    result = await uploadSmallFile(file)
    onProgress?.(100)
  }

  return result.url
}
