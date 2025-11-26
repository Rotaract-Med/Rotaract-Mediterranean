-- Create awards_page_blocks table for flexible page builder
CREATE TABLE IF NOT EXISTS awards_page_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_type TEXT NOT NULL CHECK (block_type IN ('hero', 'award_card', 'text_section', 'image_gallery', 'stats', 'timeline')),
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_data TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE awards_page_blocks ENABLE ROW LEVEL SECURITY;

-- Policies for awards_page_blocks
CREATE POLICY "Anyone can view active blocks"
  ON awards_page_blocks FOR SELECT
  USING (is_active = true);

CREATE POLICY "Media team and admins can manage blocks"
  ON awards_page_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'media_team')
    )
  );

-- Create index for ordering
CREATE INDEX idx_awards_blocks_order ON awards_page_blocks(display_order);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_awards_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_awards_blocks_timestamp
  BEFORE UPDATE ON awards_page_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_awards_blocks_updated_at();
