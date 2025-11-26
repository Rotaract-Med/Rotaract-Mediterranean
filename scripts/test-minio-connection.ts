import { S3Client, ListBucketsCommand, CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3"
import { config } from "dotenv"

// Load environment variables from .env.local
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

async function testConnection() {
  console.log("🔧 Testing MinIO Connection...")
  console.log("Endpoint:", process.env.S3_ENDPOINT)
  console.log("Access Key:", process.env.S3_ACCESS_KEY_ID)
  console.log("")

  try {
    // List buckets
    console.log("📋 Listing buckets...")
    const listCommand = new ListBucketsCommand({})
    const buckets = await s3Client.send(listCommand)
    
    console.log("✅ Connected successfully!")
    console.log("Existing buckets:", buckets.Buckets?.map(b => b.Name).join(", ") || "None")
    console.log("")

    const bucketName = process.env.S3_BUCKET_NAME || "mdiomed-media"
    const bucketExists = buckets.Buckets?.some(b => b.Name === bucketName)

    if (!bucketExists) {
      console.log(`📦 Creating bucket: ${bucketName}...`)
      const createCommand = new CreateBucketCommand({ Bucket: bucketName })
      await s3Client.send(createCommand)
      console.log("✅ Bucket created!")
      console.log("")

      // Set public policy
      console.log("🔓 Setting public read policy...")
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
          },
        ],
      }

      const policyCommand = new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(policy),
      })
      await s3Client.send(policyCommand)
      console.log("✅ Policy set!")
    } else {
      console.log(`✅ Bucket '${bucketName}' already exists!`)
    }

    console.log("")
    console.log("🎉 All checks passed! You're ready to upload files.")
    console.log(`📍 Public URL: ${process.env.S3_PUBLIC_URL}/${bucketName}`)
  } catch (error: any) {
    console.error("❌ Error:", error.message)
    console.error("")
    console.error("Troubleshooting:")
    console.error("1. Check if MinIO is running")
    console.error("2. Verify credentials in .env.local")
    console.error("3. Check network connectivity")
    process.exit(1)
  }
}

testConnection()
