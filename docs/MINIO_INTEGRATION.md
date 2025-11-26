# MinIO S3 Integration Guide

## Overview

Your MDIOMed CMS now supports MinIO S3 storage for media files (images and videos). Files are uploaded to MinIO instead of being stored as base64 in the database.

## Setup Instructions

### 1. Update Environment Variables

Edit your `.env.local` file and update the MinIO configuration:

```bash
# MinIO S3 Configuration
S3_ENDPOINT=http://your-minio-server:9000
S3_ACCESS_KEY_ID=0kqGoRzYzs9IzbpD
S3_SECRET_ACCESS_KEY=FOzM4tIU2thaGrrEdiqH4P1NEm5aSOFl
S3_BUCKET_NAME=mdiomed-media
S3_REGION=us-east-1
S3_PUBLIC_URL=http://your-minio-server:9000
```

Replace:

- `your-minio-server` with your MinIO server address (e.g., `minio.yourdomain.com` or IP address)
- Bucket name if different from `mdiomed-media`

### 2. Create MinIO Bucket

Access your MinIO console and:

1. Log in with your credentials
2. Create a new bucket named `mdiomed-media` (or your chosen name)
3. Set the bucket policy to **Public** (or configure appropriate access policies)
4. Enable versioning (optional but recommended)

Using MinIO CLI:

```bash
mc alias set myminio http://your-minio-server:9000 0kqGoRzYzs9IzbpD FOzM4tIU2thaGrrEdiqH4P1NEm5aSOFl
mc mb myminio/mdiomed-media
mc anonymous set download myminio/mdiomed-media
```

### 3. Run Database Migration

Execute the SQL migration in Supabase SQL Editor:

```sql
-- File: scripts/016_add_s3_support_media.sql
ALTER TABLE media_library
ADD COLUMN IF NOT EXISTS s3_key TEXT,
ADD COLUMN IF NOT EXISTS s3_url TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES profiles(id);

CREATE INDEX IF NOT EXISTS idx_media_library_s3_key ON media_library(s3_key);
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_by ON media_library(uploaded_by);
```

### 4. Restart Your Application

```bash
npm run dev
```

## How It Works

### File Upload Flow

1. **User uploads file** in `/dashboard/media`
2. **File is converted** to base64 in browser
3. **Sent to API** at `/api/upload`
4. **API validates** user permissions
5. **File uploaded** to MinIO S3 with unique key
6. **Metadata saved** in database with S3 URL
7. **File displayed** using S3 URL

### File Structure in MinIO

```
mdiomed-media/
├── media/
│   ├── 1732600000000-abc123-image.jpg
│   └── 1732600001000-def456-photo.png
├── videos/
│   ├── 1732600002000-ghi789-video.mp4
│   └── 1732600003000-jkl012-clip.mp4
└── documents/
    └── 1732600004000-mno345-doc.pdf
```

Files are organized by type (media/videos/documents) with timestamps and random strings to prevent collisions.

## Features

### ✅ What's Supported

- **Image uploads** (JPEG, PNG, GIF, WebP)
- **Video uploads** (MP4, WebM, MOV)
- **Automatic file organization** by type
- **Public URL generation** for easy access
- **Video preview** in media library
- **Backward compatibility** (existing base64 files still work)

### 📝 Usage

**Dashboard Upload:**

1. Go to `/dashboard/media`
2. Click "Upload Media"
3. Select image or video (max 50MB recommended)
4. Files automatically upload to S3
5. Preview and manage in media library

**Awards Hero Video:**

1. Upload video to media library
2. Copy the S3 URL
3. Go to `/dashboard/awards/settings`
4. Select "Video" tab
5. Paste the S3 URL
6. Save settings

## Database Schema

### media_library Table

| Column        | Type        | Description                    |
| ------------- | ----------- | ------------------------------ |
| `id`          | UUID        | Primary key                    |
| `file_name`   | TEXT        | Original file name             |
| `s3_key`      | TEXT        | S3 object key (path in bucket) |
| `s3_url`      | TEXT        | Public URL to access file      |
| `file_type`   | TEXT        | MIME type                      |
| `file_size`   | BIGINT      | Size in bytes                  |
| `base64_data` | TEXT        | Legacy base64 (for old files)  |
| `uploaded_by` | UUID        | User who uploaded              |
| `created_at`  | TIMESTAMPTZ | Upload timestamp               |

## Migration Strategy

### Migrating Existing Files

If you have existing base64 files and want to migrate them to S3:

1. Create a migration script (optional, not required - app works with both)
2. Files with `s3_url` will use S3
3. Files without `s3_url` will use `base64_data`
4. New uploads automatically go to S3

## Troubleshooting

### Files Not Uploading

**Check:**

1. MinIO service is running
2. Environment variables are correct
3. Bucket exists and is accessible
4. Network connectivity to MinIO server

**Test MinIO Connection:**

```bash
curl http://your-minio-server:9000/minio/health/live
```

### CORS Issues

If accessing from browser, configure MinIO CORS:

```bash
mc admin config set myminio api cors_allow_origin="http://localhost:3000"
mc admin service restart myminio
```

### Permission Errors

Ensure:

- User has `admin`, `media_team`, or `journalist` role
- Bucket policy allows public read access
- S3 credentials have write permissions

## Performance Tips

1. **Use CDN** for production (CloudFlare, AWS CloudFront)
2. **Compress videos** before uploading (recommended: H.264, 1080p)
3. **Optimize images** (use WebP format when possible)
4. **Set cache headers** in MinIO for better performance

## Security Considerations

- ✅ Files stored in S3, not database (better performance)
- ✅ Unique file keys prevent overwrites
- ✅ User authentication required for uploads
- ✅ Role-based access control
- ⚠️ Public bucket (files accessible to anyone with URL)
- 💡 Consider signed URLs for sensitive content

## Next Steps

- [ ] Set up automatic video transcoding (optional)
- [ ] Configure CDN for faster delivery
- [ ] Add file size limits in UI
- [ ] Implement bulk upload
- [ ] Add file compression before upload
