-- Add SEO/social fields to articles
ALTER TABLE public.articles
ADD COLUMN
IF NOT EXISTS seo_title TEXT,
ADD COLUMN
IF NOT EXISTS seo_description TEXT,
ADD COLUMN
IF NOT EXISTS og_image TEXT;

COMMENT ON COLUMN public.articles.seo_title IS 'Overrides <title> / og:title. Falls back to title when blank.';
COMMENT ON COLUMN public.articles.seo_description IS 'Overrides meta description / og:description. Falls back to excerpt when blank.';
COMMENT ON COLUMN public.articles.og_image IS 'Overrides og:image. Falls back to featured_image when blank.';

-- articles.updated_at was never kept current (no trigger existed) - fix it
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_articles_timestamp
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION update_articles_updated_at();
