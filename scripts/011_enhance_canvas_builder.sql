-- Enhanced canvas builder with support for more component types and properties

-- Drop existing table and recreate with enhanced schema
DROP TABLE IF EXISTS awards_canvas_elements CASCADE;

CREATE TABLE awards_canvas_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  element_type TEXT NOT NULL, -- Component type
  content JSONB NOT NULL DEFAULT '{}'::jsonb, -- Element-specific content
  
  -- Position and size
  x_position NUMERIC NOT NULL DEFAULT 0,
  y_position NUMERIC NOT NULL DEFAULT 0,
  width NUMERIC NOT NULL DEFAULT 200,
  height NUMERIC NOT NULL DEFAULT 100,
  
  -- Layout properties
  padding_top NUMERIC DEFAULT 0,
  padding_right NUMERIC DEFAULT 0,
  padding_bottom NUMERIC DEFAULT 0,
  padding_left NUMERIC DEFAULT 0,
  margin_top NUMERIC DEFAULT 0,
  margin_right NUMERIC DEFAULT 0,
  margin_bottom NUMERIC DEFAULT 0,
  margin_left NUMERIC DEFAULT 0,
  
  -- Styling
  background_color TEXT DEFAULT 'transparent',
  border_width NUMERIC DEFAULT 0,
  border_color TEXT DEFAULT '#000000',
  border_radius NUMERIC DEFAULT 0,
  box_shadow TEXT DEFAULT 'none',
  z_index INTEGER NOT NULL DEFAULT 0,
  rotation NUMERIC DEFAULT 0,
  opacity NUMERIC DEFAULT 1,
  
  -- Typography (for text elements)
  font_family TEXT DEFAULT 'inherit',
  font_size NUMERIC DEFAULT 16,
  font_weight TEXT DEFAULT 'normal',
  text_align TEXT DEFAULT 'left',
  text_color TEXT DEFAULT '#000000',
  line_height NUMERIC DEFAULT 1.5,
  
  -- Responsive settings
  position_unit TEXT DEFAULT 'px',
  size_unit TEXT DEFAULT 'px',
  
  -- Hierarchy
  parent_id UUID REFERENCES awards_canvas_elements(id) ON DELETE CASCADE,
  
  -- Visibility and order
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

-- Indexes
CREATE INDEX idx_canvas_elements_order ON awards_canvas_elements(display_order, z_index);
CREATE INDEX idx_canvas_elements_parent ON awards_canvas_elements(parent_id);
