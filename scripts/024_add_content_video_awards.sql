-- Add content video support to awards_settings
-- Used for the optional video window beside the hero title / "Discover more"

ALTER TABLE awards_settings
ADD COLUMN IF NOT EXISTS content_video_url TEXT,
ADD COLUMN IF NOT EXISTS content_video_enabled BOOLEAN NOT NULL DEFAULT false;
