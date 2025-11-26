-- Fix RLS policies to allow proper dashboard access

-- Drop existing articles policies
DROP POLICY IF EXISTS "Anyone can view published articles" ON public.articles;

-- Create new policies for articles
CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  USING (status = 'published' AND auth.uid() IS NULL);

CREATE POLICY "Authenticated users can view published articles"
  ON public.articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authors can view own articles"
  ON public.articles FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Journalists and admins can view all articles"
  ON public.articles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('journalist', 'admin')
    )
  );
