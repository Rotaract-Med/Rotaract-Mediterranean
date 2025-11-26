-- Add video support to awards_settings
ALTER TABLE awards_settings 
ADD COLUMN
IF NOT EXISTS hero_video_url TEXT,
ADD COLUMN
IF NOT EXISTS hero_type TEXT DEFAULT 'image' CHECK
(hero_type IN
('image', 'video'));

-- Update the default settings to use video
UPDATE awards_settings 
SET hero_type = 'video'
WHERE id IN (SELECT id
FROM awards_settings LIMIT
1);
