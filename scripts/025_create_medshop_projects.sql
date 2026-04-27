-- Create medshop_projects table for dynamic MedShop navigation links
CREATE TABLE IF NOT EXISTS medshop_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE medshop_projects ENABLE ROW LEVEL SECURITY;

-- Public can read active items
CREATE POLICY "Anyone can view active medshop projects"
  ON medshop_projects FOR SELECT
  USING (is_active = true);

-- Only admins can manage
CREATE POLICY "Only admins can manage medshop projects"
  ON medshop_projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create index for ordering
CREATE INDEX idx_medshop_projects_order ON medshop_projects(display_order);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_medshop_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_medshop_projects_timestamp
  BEFORE UPDATE ON medshop_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_medshop_projects_updated_at();
