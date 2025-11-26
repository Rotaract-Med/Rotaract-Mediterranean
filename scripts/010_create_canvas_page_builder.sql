-- Canvas-based page builder for awards page
-- Stores elements with precise positioning (x, y, width, height)

CREATE TABLE IF NOT EXISTS awards_canvas_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  element_type TEXT NOT NULL, -- 'text', 'image', 'heading', 'button', 'card', 'icon'
  content JSONB NOT NULL DEFAULT '{}'::jsonb, -- Stores element-specific data
  
  -- Position and size (in pixels or percentage)
  x_position NUMERIC NOT NULL DEFAULT 0, -- X coordinate
  y_position NUMERIC NOT NULL DEFAULT 0, -- Y coordinate
  width NUMERIC NOT NULL DEFAULT 200, -- Width
  height NUMERIC NOT NULL DEFAULT 100, -- Height
  
  -- Styling
  z_index INTEGER NOT NULL DEFAULT 0, -- Layering
  rotation NUMERIC DEFAULT 0, -- Rotation in degrees
  opacity NUMERIC DEFAULT 1, -- 0 to 1
  
  -- Responsive settings
  position_unit TEXT DEFAULT 'px', -- 'px' or '%'
  size_unit TEXT DEFAULT 'px', -- 'px' or '%'
  
  -- Visibility
  is_visible BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE awards_canvas_elements ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view visible canvas elements"
  ON awards_canvas_elements FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Media team and admins can manage canvas elements"
  ON awards_canvas_elements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'media_team')
    )
  );

-- Create index for ordering
CREATE INDEX idx_canvas_elements_order ON awards_canvas_elements(display_order, z_index);
