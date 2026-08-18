-- 027_allow_journalist_pdf_media_upload.sql scoped journalist media_library
-- INSERT to file_type = 'application/pdf' only. Imported PDF page renders
-- (lib/pdf-parser.ts) don't touch media_library at all anymore - they upload
-- straight to S3 via /api/upload/presigned and skip the DB record entirely,
-- specifically so bulk-importing a multi-page PDF doesn't dump a row per
-- page into the table media_team browses.
--
-- What still needs this policy: inline images a journalist actually chooses
-- to type/paste/drop directly into article content (via the editor's image
-- upload button/paste/drag handling, components/editor/image-upload.ts)
-- deliberately do go through media_library - those are real authored media,
-- not mechanical by-products, so media_team seeing them is expected. That
-- path was blocked for journalists the same way PDF uploads were. Since
-- journalists are meant to have full control over authoring articles
-- (including embedding images in content), this replaces the PDF-only
-- policy with a general one. The dedicated Media Library management page
-- (app/dashboard/media/page.tsx) still gates its own upload UI behind
-- hasPermission(role, "media", "create"), which remains admin/media_team
-- only - this only unblocks the insert path articles themselves rely on.

DROP POLICY IF EXISTS "Journalists can upload PDF documents" ON public.media_library;

CREATE POLICY "Journalists can upload media"
  ON public.media_library FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'journalist'
    )
  );
