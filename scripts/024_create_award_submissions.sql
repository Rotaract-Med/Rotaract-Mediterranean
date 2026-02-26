-- Migration 024: Create award_submissions table
-- This table stores project submissions for the Mediterranean Outstanding Project Awards

CREATE TABLE IF NOT EXISTS public.award_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Applicant Information
  full_name TEXT NOT NULL,
  club_name TEXT NOT NULL,
  country TEXT NOT NULL,
  district_number TEXT NOT NULL,
  
  -- Project Information
  project_name TEXT NOT NULL,
  med_category TEXT NOT NULL CHECK (med_category IN ('MedLove', 'MedNature', 'MedCulture', 'MedPeace', 'MedTwinning', 'MedExcellence')),
  
  -- File Information
  file_name TEXT,
  file_size BIGINT,
  google_drive_file_id TEXT,
  google_drive_link TEXT,
  
  -- Metadata
  submission_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  reviewer_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_award_submissions_category ON public.award_submissions(med_category);
CREATE INDEX IF NOT EXISTS idx_award_submissions_status ON public.award_submissions(status);
CREATE INDEX IF NOT EXISTS idx_award_submissions_date ON public.award_submissions(submission_date DESC);
CREATE INDEX IF NOT EXISTS idx_award_submissions_country ON public.award_submissions(country);

-- Enable RLS
ALTER TABLE public.award_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit (insert)
CREATE POLICY "Anyone can submit award applications"
  ON public.award_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Only admins can view all submissions
CREATE POLICY "Admins can view all submissions"
  ON public.award_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Only admins can update submissions
CREATE POLICY "Admins can update submissions"
  ON public.award_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Only admins can delete submissions
CREATE POLICY "Admins can delete submissions"
  ON public.award_submissions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_award_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER award_submissions_updated_at
  BEFORE UPDATE ON public.award_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_award_submissions_updated_at();

-- Grant permissions
GRANT SELECT, INSERT ON public.award_submissions TO anon;
GRANT ALL ON public.award_submissions TO authenticated;

COMMENT ON TABLE public.award_submissions IS 'Stores project submissions for Mediterranean Outstanding Project Awards';
