-- Add S3 support to media_library table
ALTER TABLE media_library
ADD COLUMN IF NOT EXISTS s3_key TEXT,
ADD COLUMN IF NOT EXISTS s3_url TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES profiles(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_media_library_s3_key ON media_library(s3_key);
CREATE INDEX IF NOT EXISTS idx_media_library_uploaded_by ON media_library(uploaded_by);

-- Add comment
COMMENT ON COLUMN media_library.s3_key IS 'S3/MinIO object key for the file';
COMMENT ON COLUMN media_library.s3_url IS 'Public URL to access the file from S3/MinIO';
COMMENT ON COLUMN media_library.file_size IS 'File size in bytes';
COMMENT ON COLUMN media_library.uploaded_by IS 'User who uploaded the file';
