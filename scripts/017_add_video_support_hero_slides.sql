-- Add video support to hero_slides table
ALTER TABLE hero_slides
ADD COLUMN
IF NOT EXISTS media_type TEXT DEFAULT 'image' CHECK
(media_type IN
('image', 'video')),
ADD COLUMN
IF NOT EXISTS media_url TEXT,
ADD COLUMN
IF NOT EXISTS s3_key TEXT;

-- Add comment
COMMENT ON COLUMN hero_slides.media_type IS 'Type of media: image or video';
COMMENT ON COLUMN hero_slides.media_url IS 'URL to the media file (S3 or external)';
COMMENT ON COLUMN hero_slides.s3_key IS 'S3 key if stored in MinIO';

-- Create index for faster lookups
CREATE INDEX
IF NOT EXISTS idx_hero_slides_media_type ON hero_slides
(media_type);
