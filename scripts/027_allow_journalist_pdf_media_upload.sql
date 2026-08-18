-- app/api/upload/route.ts and app/api/upload/presigned/route.ts already allow the
-- journalist role (needed so journalists can attach a PDF to a "pdf" type article),
-- but the media_library INSERT policy from 004_create_media_library_table.sql only
-- ever allowed media_team/admin. Journalists passed the API-level check and then had
-- their media_library insert silently rejected by RLS, making PDF upload look broken.
--
-- Scoped to PDFs only so journalists still can't upload general media (images, video) -
-- that stays media_team/admin via the existing policy. Postgres OR's multiple permissive
-- policies for the same command together, so this simply adds an allowance.

CREATE POLICY "Journalists can upload PDF documents"
  ON public.media_library FOR INSERT
  WITH CHECK (
    file_type = 'application/pdf'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'journalist'
    )
  );
