-- Add base64_data column to store image data directly
ALTER TABLE public.media_library 
ADD COLUMN IF NOT EXISTS base64_data TEXT;

-- Update file_url to be nullable since we'll store base64 instead
ALTER TABLE public.media_library 
ALTER COLUMN file_url DROP NOT NULL;
