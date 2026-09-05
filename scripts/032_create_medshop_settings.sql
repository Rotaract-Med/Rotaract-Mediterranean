-- Controls what the public /medshop page shows: the Coming Soon page,
-- or a redirect to a real storefront URL once one exists.
CREATE TABLE IF NOT EXISTS medshop_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode TEXT NOT NULL DEFAULT 'coming_soon' CHECK (mode IN ('coming_soon', 'redirect')),
  redirect_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed a single settings row (only if none exists yet)
INSERT INTO medshop_settings (mode, redirect_url)
SELECT 'coming_soon', NULL
WHERE NOT EXISTS (SELECT 1 FROM medshop_settings);

ALTER TABLE medshop_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view medshop settings"
  ON medshop_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update medshop settings"
  ON medshop_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
