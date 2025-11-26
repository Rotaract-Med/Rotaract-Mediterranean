-- Create media library table
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  alt_text TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Policies for media library
CREATE POLICY "Anyone can view media"
  ON public.media_library FOR SELECT
  USING (true);

CREATE POLICY "Media team and admins can upload media"
  ON public.media_library FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('media_team', 'admin')
    )
  );

CREATE POLICY "Uploaders can update own media"
  ON public.media_library FOR UPDATE
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Admins can update any media"
  ON public.media_library FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Uploaders can delete own media"
  ON public.media_library FOR DELETE
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Admins can delete any media"
  ON public.media_library FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX idx_media_uploaded_by ON public.media_library(uploaded_by);
CREATE INDEX idx_media_file_type ON public.media_library(file_type);
