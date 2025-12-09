-- Create events_submenu table for dynamic navigation links
CREATE TABLE IF NOT EXISTS events_submenu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE events_submenu ENABLE ROW LEVEL SECURITY;

-- Public can read active items
CREATE POLICY "Anyone can view active events submenu"
  ON events_submenu FOR SELECT
  USING (is_active = true);

-- Only admins can manage
CREATE POLICY "Only admins can manage events submenu"
  ON events_submenu FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create index for ordering
CREATE INDEX idx_events_submenu_order ON events_submenu(display_order);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_events_submenu_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_submenu_timestamp
  BEFORE UPDATE ON events_submenu
  FOR EACH ROW
  EXECUTE FUNCTION update_events_submenu_updated_at();

-- Insert default values
INSERT INTO events_submenu (title, url, display_order, is_active) VALUES
  ('M2R', '/events/m2r', 1, true),
  ('MEDICON', '/events/medicon', 2, true),
  ('PEACE CONFERENCE', '/events/peace-conference', 3, true);
