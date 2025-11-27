# Large File Upload Setup Guide

This guide explains how to configure and use the direct S3 upload feature for files larger than 3MB (up to 100MB).

## Overview

The application now supports two upload methods:

1. **Standard Upload** (≤3MB): Via API route with base64 encoding - suitable for small images
2. **Direct S3 Upload** (≤100MB): Direct browser-to-S3 upload using presigned URLs - for large PDFs, videos, etc.

## Architecture

### Standard Upload Flow

```
Browser → Base64 Encode → /api/upload → S3 → Supabase metadata
```

**Limitation**: Vercel's 4.5MB API body limit prevents large files

### Direct S3 Upload Flow

```
Browser → /api/upload/presigned (get temporary URL) → Direct PUT to S3 → Supabase metadata
```

**Advantages**:

- Bypasses Vercel function limits
- No base64 overhead (33% size increase)
- Progress tracking with XMLHttpRequest
- Secure: S3 credentials never exposed to client

## Setup Instructions

### 1. Add Environment Variables

Add these to your `.env.local` (local development) and Vercel Environment Variables (production):

```bash
# Server-side S3 credentials (DO NOT prefix with NEXT_PUBLIC)
S3_ENDPOINT=http://your-minio-endpoint:9000
S3_BUCKET_NAME=mdio
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your_minio_access_key
S3_SECRET_ACCESS_KEY=your_minio_secret_key
S3_PUBLIC_URL=http://your-minio-endpoint:9000
```

**Important**: These variables are **server-side only**. They're used in `/api/upload/presigned` to generate temporary presigned URLs. Never prefix them with `NEXT_PUBLIC_`.

### 2. Configure MinIO/S3 Bucket

Your S3 bucket needs proper CORS configuration to allow direct uploads from the browser.

#### MinIO CORS Configuration

1. Access MinIO console
2. Go to your bucket settings
3. Add CORS rule:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": [
        "http://localhost:3000",
        "https://your-vercel-domain.vercel.app"
      ],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}
```

#### Or via MinIO Client (mc):

```bash
mc cors set mybucket --cors-rules '[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.vercel.app"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["*"]
  }
]'
```

### 3. Verify Installation

After setting environment variables and CORS:

1. Restart your Next.js development server:

   ```bash
   npm run dev
   ```

2. In production, redeploy to Vercel:

   ```bash
   git push
   ```

3. Test upload:
   - Navigate to `/dashboard/media`
   - Click "Upload Large File (100MB)"
   - Select a file >3MB (like your 34MB PDFs)
   - Monitor progress bar
   - Verify file appears in media library

## Usage

### In the Dashboard

Navigate to **Dashboard → Media Library**:

- **"Upload File"** button: Standard upload for small files (≤3MB)
- **"Upload Large File (100MB)"** button: Direct S3 upload for large files

### File Size Limits

| Upload Method    | Max Size | Use Case                   |
| ---------------- | -------- | -------------------------- |
| Standard Upload  | 3MB      | Small images, icons        |
| Direct S3 Upload | 100MB    | PDFs, large images, videos |

The 100MB limit is enforced client-side and can be adjusted in `components/direct-s3-upload-dialog.tsx` (line 30).

## Security

### Presigned URLs

The `/api/upload/presigned` route generates temporary, signed URLs that:

- Expire after 10 minutes
- Allow only PUT operations
- Are specific to one file/key
- Include authentication checks (user must be logged in)
- Include role checks (admin, media_team, or journalist)

### Permission Checks

The presigned URL API enforces:

```typescript
if (!["admin", "media_team", "journalist"].includes(profile.role)) {
  return 403 Forbidden
}
```

## Troubleshooting

### "Failed to get upload URL"

**Cause**: Missing or incorrect S3 environment variables

**Solution**:

1. Verify all S3\_\* variables are set in your environment
2. Check that variables are NOT prefixed with NEXT*PUBLIC*
3. Restart dev server or redeploy to Vercel

### "Network error during upload" or CORS errors

**Cause**: Missing or incorrect CORS configuration on S3/MinIO

**Solution**:

1. Add your domain to AllowedOrigins in bucket CORS policy
2. Ensure "PUT" is in AllowedMethods
3. Check browser console for specific CORS error messages

### "Upload failed with status 403"

**Cause**: S3 credentials invalid or presigned URL expired

**Solution**:

1. Verify S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY are correct
2. Check that MinIO user has write permissions to bucket
3. Ensure system clock is synchronized (presigned URLs are time-sensitive)

### File uploads but doesn't appear in media library

**Cause**: Metadata not saved to Supabase

**Solution**:

1. Check browser console for database errors
2. Verify user has permission to insert into media_library table
3. Check Supabase RLS policies

## Advanced Configuration

### Increase File Size Limit

Edit `components/direct-s3-upload-dialog.tsx`:

```typescript
const MAX_FILE_SIZE = 200 * 1024 * 1024; // Change to 200MB
```

### Adjust Presigned URL Expiry

Edit `app/api/upload/presigned/route.ts`:

```typescript
const presignedUrl = await getSignedUrl(s3Client, command, {
  expiresIn: 1800, // Change to 30 minutes
});
```

### Add File Type Restrictions

In `direct-s3-upload-dialog.tsx`, modify the accept attribute:

```typescript
<Input
  type="file"
  accept=".pdf,.mp4,.mov,.avi" // Only allow specific types
  onChange={handleFileSelect}
/>
```

## Files Modified

| File                                     | Purpose                             |
| ---------------------------------------- | ----------------------------------- |
| `app/api/upload/presigned/route.ts`      | Generates presigned S3 URLs         |
| `components/direct-s3-upload-dialog.tsx` | Client-side upload UI with progress |
| `app/dashboard/media/page.tsx`           | Integrated both upload methods      |
| `.env.example`                           | Environment variable template       |

## Migration from Old Upload Method

If you have existing code using the old direct S3 upload (with NEXT*PUBLIC* credentials), migrate to presigned URLs:

**Old (insecure)**:

```typescript
// Exposed credentials to client
const url = `${process.env.NEXT_PUBLIC_S3_ENDPOINT}/${bucket}/${key}`;
xhr.setRequestHeader("x-amz-access-key-id", accessKey);
```

**New (secure)**:

```typescript
// Get temporary presigned URL from backend
const { presignedUrl } = await fetch('/api/upload/presigned', {...})
xhr.open('PUT', presignedUrl)
```

## Testing Checklist

- [ ] Environment variables set in .env.local
- [ ] Environment variables set in Vercel project settings
- [ ] MinIO/S3 CORS configured with your domain
- [ ] Dev server restarted
- [ ] Production redeployed
- [ ] Can upload file ≤3MB via standard upload
- [ ] Can upload file >3MB via direct S3 upload
- [ ] Progress bar displays during upload
- [ ] File appears in media library after upload
- [ ] File accessible via public URL
- [ ] Browser console shows no CORS errors
