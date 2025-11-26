-- Add PDF support to articles table
ALTER TABLE public.articles
ADD COLUMN
IF NOT EXISTS pdf_url TEXT,
ADD COLUMN
IF NOT EXISTS pdf_s3_key TEXT,
ADD COLUMN
IF NOT EXISTS article_type TEXT DEFAULT 'content' CHECK
(article_type IN
('content', 'pdf'));

-- Update existing articles to have article_type 'content'
UPDATE public.articles
SET article_type = 'content'
WHERE article_type IS NULL;

-- Add comment explaining the columns
COMMENT ON COLUMN public.articles.pdf_url IS 'S3 URL for PDF articles uploaded directly';
COMMENT ON COLUMN public.articles.pdf_s3_key IS 'S3 key for PDF deletion';
COMMENT ON COLUMN public.articles.article_type IS 'Type of article: content (traditional HTML) or pdf (embedded PDF)';
