-- Add collaborators section to team_members and create collaborator_images table

-- Update team_members section constraint to include collaborators
ALTER TABLE public.team_members 
DROP CONSTRAINT IF EXISTS team_members_section_check;

ALTER TABLE public.team_members 
ADD CONSTRAINT team_members_section_check 
CHECK (section IN ('executive_board', 'country_representatives', 'collaborators'));

-- Create collaborator_images table for the home page carousel
CREATE TABLE
IF NOT EXISTS public.collaborator_images
(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid
(),
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW
(),
  updated_at TIMESTAMPTZ DEFAULT NOW
()
);

-- Enable RLS
ALTER TABLE public.collaborator_images ENABLE ROW LEVEL SECURITY;

-- Policies for collaborator_images
CREATE POLICY "Anyone can view collaborator images"
  ON public.collaborator_images FOR
SELECT
    USING (true);

CREATE POLICY "Admins can insert collaborator images"
  ON public.collaborator_images FOR
INSERT
  WITH CHECK
    (
    EXISTS (
    SELECT
    1 
    O
 public.profil
    WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can update collaborator images"
  ON public.collaborator_images FOR
UPDATE
  USING (
    EXISTS (
      SELECT 1
FROM public.profiles
WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can delete collaborator images"
  ON public.collaborator_images FOR
DELETE
  USING (
    EXISTS
(
      SELECT 1
FROM public.profiles
WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Create index for faster queries
CREATE INDEX
IF NOT EXISTS idx_collaborator_images_display_order 
ON public.collaborator_images
(display_order);
