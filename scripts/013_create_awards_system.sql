-- Drop old canvas tables
DROP TABLE IF EXISTS awards_canvas_elements CASCADE;

-- Create awards settings table
CREATE TABLE IF NOT EXISTS awards_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL DEFAULT '2024',
  title TEXT NOT NULL DEFAULT 'Mediterranean Excellence Awards',
  background_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create awards submissions table
CREATE TABLE IF NOT EXISTS award_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nominee_name TEXT NOT NULL,
  category TEXT NOT NULL,
  organization TEXT,
  description TEXT NOT NULL,
  email TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Insert default settings
INSERT INTO awards_settings (year, title, background_image)
VALUES ('2024', 'Mediterranean Excellence Awards', NULL)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE awards_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE award_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for awards_settings
CREATE POLICY "Anyone can view awards settings"
  ON awards_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins and media team can update awards settings"
  ON awards_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'media_team')
    )
  );

-- RLS Policies for award_submissions
CREATE POLICY "Anyone can submit awards"
  ON award_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins and media team can view all submissions"
  ON award_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'media_team')
    )
  );

CREATE POLICY "Admins can update submission status"
  ON award_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
