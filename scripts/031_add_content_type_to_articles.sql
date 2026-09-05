-- Distinguish articles from newsletters within the same articles table.
-- Separate from `category` (Culture/Nature/Love/Events/Stories), which tags topic, not content type.
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'article'
    CHECK (content_type IN ('article', 'newsletter'));

CREATE INDEX IF NOT EXISTS idx_articles_content_type ON public.articles(content_type);
