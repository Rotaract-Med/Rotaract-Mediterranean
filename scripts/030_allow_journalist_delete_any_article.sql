-- Mirrors 028_allow_journalist_edit_any_article.sql for DELETE. Same original
-- gap: 002_create_articles_table.sql only ever granted authors DELETE on
-- their own rows ("Authors can delete own articles", USING auth.uid() =
-- author_id) plus an admin-only "can delete any article" policy. Journalists
-- now get full control over the articles section per product decision, so
-- delete should work the same as edit already does - any article, not just
-- their own.

CREATE POLICY "Journalists can delete any article"
  ON public.articles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'journalist'
    )
  );
