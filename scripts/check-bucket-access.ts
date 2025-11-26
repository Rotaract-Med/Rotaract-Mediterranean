import { S3Client, ListObjectsV2Command, GetBucketPolicyCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3"
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

async function checkBucketAccess() {
  console.log("🔍 Checking MinIO bucket access...\n")

  try {
    // List objects in bucket
    console.log("📁 Listing objects in bucket:", bucketName)
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 5,
    })
    const listResult = await s3Client.send(listCommand)
    
    if (listResult.Contents && listResult.Contents.length > 0) {
      console.log(`✅ Found ${listResult.Contents.length} objects:`)
      listResult.Contents.forEach((obj) => {
        const url = `${process.env.S3_PUBLIC_URL}/${bucketName}/${obj.Key}`
        console.log(`  - ${obj.Key}`)
        console.log(`    URL: ${url}`)
        console.log(`    Size: ${obj.Size} bytes`)
      })
    } else {
      console.log("📭 No objects found in bucket")
    }

    // Check bucket policy
    console.log("\n📋 Checking bucket policy...")
    try {
      const policyCommand = new GetBucketPolicyCommand({
        Bucket: bucketName,
      })
      const policyResult = await s3Client.send(policyCommand)
      console.log("Current policy:", JSON.stringify(JSON.parse(policyResult.Policy!), null, 2))
    } catch (error: any) {
      if (error.Code === "NoSuchBucketPolicy") {
        console.log("⚠️  No bucket policy set - bucket is not publicly accessible!")
        console.log("\n🔧 Attempting to set public read policy...")
        
        const publicPolicy = {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: "*",
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${bucketName}/*`],
            },
          ],
        }

        try {
          const setPolicyCommand = new PutBucketPolicyCommand({
            Bucket: bucketName,
            Policy: JSON.stringify(publicPolicy),
          })
          await s3Client.send(setPolicyCommand)
          console.log("✅ Public read policy set successfully!")
          console.log("Policy:", JSON.stringify(publicPolicy, null, 2))
        } catch (setPolicyError: any) {
          console.error("❌ Failed to set bucket policy:", setPolicyError.message)
          console.log("\n⚠️  You may need to set the bucket policy manually in MinIO Console:")
          console.log("Policy to apply:")
          console.log(JSON.stringify(publicPolicy, null, 2))
        }
      } else {
        throw error
      }
    }

    console.log("\n🎉 Diagnostic complete!")
    console.log("\n💡 If images still don't load, try:")
    console.log("1. Access MinIO Console and set bucket to 'public' or 'download'")
    console.log("2. Check browser console for actual error messages")
    console.log("3. Try accessing a file URL directly in your browser")
    
  } catch (error: any) {
    console.error("❌ Error:", error.message)
    console.error("Full error:", error)
  }
}

checkBucketAccess()
