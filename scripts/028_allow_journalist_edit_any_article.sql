-- Journalists should be able to edit any article, not just their own (per product decision).
-- 002_create_articles_table.sql only ever granted authors UPDATE on their own rows
-- ("Authors can update own articles", USING auth.uid() = author_id) plus a separate
-- admin-only "can update any article" policy. Journalists therefore had no path to
-- update articles they didn't author. This adds the missing journalist-wide policy,
-- mirroring the existing admin one. Delete stays author/admin-only - not covered here.

CREATE POLICY "Journalists can update any article"
  ON public.articles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'journalist'
    )
  );
