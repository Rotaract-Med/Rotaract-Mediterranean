import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from "@aws-sdk/client-s3"
import { config } from "dotenv"

config({ path: ".env.local" })

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
})

const bucketName = process.env.S3_BUCKET_NAME!

async function setupCORS() {
  console.log("🔧 Setting up CORS for MinIO bucket:", bucketName)

  try {
    // Check existing CORS
    try {
      const getCorsCommand = new GetBucketCorsCommand({
        Bucket: bucketName,
      })
      const existingCors = await s3Client.send(getCorsCommand)
      console.log("📋 Existing CORS rules:", JSON.stringify(existingCors.CORSRules, null, 2))
    } catch (error: any) {
      if (error.Code === "NoSuchCORSConfiguration") {
        console.log("📋 No existing CORS configuration found")
      }
    }

    // Set CORS configuration
    const corsCommand = new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ["*"],
            AllowedMethods: ["GET", "HEAD", "PUT", "POST", "DELETE"],
            AllowedOrigins: ["*"],
            ExposeHeaders: ["ETag", "x-amz-request-id", "x-amz-id-2"],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    })

    await s3Client.send(corsCommand)
    console.log("✅ CORS configuration set successfully!")
    console.log("\nCORS Rules:")
    console.log("- Allowed Origins: * (all)")
    console.log("- Allowed Methods: GET, HEAD, PUT, POST, DELETE")
    console.log("- Allowed Headers: * (all)")
    console.log("\n🎉 Your bucket is now configured for public access with CORS!")
  } catch (error: any) {
    console.error("❌ Error setting up CORS:", error.message)
    console.error("Full error:", error)
    process.exit(1)
  }
}

setupCORS()
