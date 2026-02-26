# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MDIOMed is a Next.js 14 App Router CMS for the Rotaract Mediterranean organization. It manages articles (MEDTimes), team members, media library, hero slides, awards, and public content. Backend is Supabase (auth + PostgreSQL) with hybrid media storage (base64 in DB + S3/MinIO for large files).

## Commands

```bash
npm run dev          # Dev server on :3000
npm run build        # Production build
npm run lint         # ESLint
npm run test:minio   # Test MinIO/S3 connection
```

No test suite exists. Manual testing uses accounts in `TEST_USERS.md` (4 roles x multiple users).

Database migrations are numbered SQL files in `scripts/` (001-023), run manually in Supabase SQL editor.

## Architecture

### Supabase Client Split (Critical)

Server Components/Route Handlers use the async server client:
```tsx
import { createClient } from "@/lib/server";
const supabase = await createClient(); // must await
```

Client Components use the synchronous browser client:
```tsx
import { createClient } from "@/lib/client";
const supabase = createClient(); // no await
```

Mixing these up breaks authentication. Server client uses Next.js cookies; client uses browser storage.

### Server-Client Composition

Dashboard uses a server component layout (`app/dashboard/layout.tsx`) that handles auth, then passes data to `components/dashboard-layout-client.tsx` for interactivity. This pattern is used throughout.

### RBAC System

Centralized in `lib/permissions.ts`. Four roles: `admin`, `journalist`, `media_team`, `member`. Always use `hasPermission(role, resource, action)` rather than hardcoding role checks.

### Form Mutation Pattern

After any Supabase mutation in client components, always call `router.refresh()` to revalidate server component cache. See `components/article-form.tsx` for reference.

### Media Storage

Hybrid approach: legacy base64 in `media_library` table, modern S3/MinIO via `lib/s3.ts` with presigned URLs. Both are supported simultaneously. Upload API route has 60s timeout and 1GB memory limit (configured in `vercel.json`).

## Key Files

- `middleware.ts` — Auth session management, protects `/dashboard/*` routes
- `lib/permissions.ts` — RBAC permission definitions
- `lib/server.ts` / `lib/client.ts` — Supabase client factories
- `lib/s3.ts` — S3/MinIO utilities
- `components/rich-text-editor.tsx` — WYSIWYG editor (contentEditable + execCommand, outputs raw HTML)
- `components/canvas-page-builder.tsx` — Drag-and-drop visual editor for awards pages
- `components/media-selector.tsx` — Media library picker used across forms

## Route Structure

- Public: `/`, `/medtimes`, `/team`, `/awards`, `/about/*`, `/medculture`, `/medlove`, `/mednature`
- Auth: `/auth/login` (Supabase email/password with PKCE)
- Protected: `/dashboard/*` (articles, team, media, hero-slides, awards, settings)
- API: `/api/upload`, `/api/upload/presigned`, `/api/media/[id]`, `/api/awards/submit`

## Styling

Tailwind CSS with shadcn/ui (new-york style). Primary: `#193fa6` (blue), accent: `#D4AF37` (gold). Dark mode supported via class-based toggling. Path alias `@/*` maps to project root.

## Common Pitfalls

- Using `createClient` from wrong import path (server vs client)
- Forgetting `"use client"` directive on interactive components
- Not calling `router.refresh()` after data mutations
- Missing `await` on server `createClient()`
- Hardcoding role checks instead of using `hasPermission()`

## Environment Variables

See `.env.local.example`. Requires Supabase URL/key and S3 credentials. `NEXT_PUBLIC_COMING_SOON` toggles coming-soon mode for medshop.
