-- Create hero_slides table
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  image_data TEXT NOT NULL, -- Base64 image data or media library reference
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active slides
CREATE POLICY "Anyone can view active hero slides"
  ON public.hero_slides
  FOR SELECT
  USING (is_active = true);

-- Policy: Media team and admins can view all slides
CREATE POLICY "Media team and admins can view all hero slides"
  ON public.hero_slides
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'media_team')
    )
  );

-- Policy: Media team and admins can insert slides
CREATE POLICY "Media team and admins can insert hero slides"
  ON public.hero_slides
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'media_team')
    )
  );

-- Policy: Media team and admins can update slides
CREATE POLICY "Media team and admins can update hero slides"
  ON public.hero_slides
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'media_team')
    )
  );

-- Policy: Admins can delete slides
CREATE POLICY "Admins can delete hero slides"
  ON public.hero_slides
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create index for ordering
CREATE INDEX idx_hero_slides_order ON public.hero_slides(display_order);
CREATE INDEX idx_hero_slides_active ON public.hero_slides(is_active);
