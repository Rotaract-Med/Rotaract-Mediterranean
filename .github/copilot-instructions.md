# MDIOMed CMS - Copilot Instructions

## Architecture Overview

This is a Next.js 14 App Router application with Supabase backend, built for the Rotaract Mediterranean organization. The app provides a role-based CMS for managing articles (MEDTimes), team members, media library, hero slides, and an awards system with canvas-based page builder.

### Key Layers

- **Server Components** (`app/`): Authentication checks, data fetching via `createClient()` from `@/lib/server`
- **Client Components** (`components/`): Interactive forms, editors, dashboards - always marked with `"use client"`
- **Middleware** (`middleware.ts`): Auth session management and role-based redirects
- **Permissions** (`lib/permissions.ts`): Centralized RBAC with 4 roles: `admin`, `journalist`, `media_team`, `member`

## Critical Patterns

### 1. Supabase Client Split (IMPORTANT)

Always use the correct Supabase client based on component type:

```tsx
// ✅ Server Components/Route Handlers
import { createClient } from "@/lib/server";
const supabase = await createClient(); // async/await required

// ✅ Client Components
import { createClient } from "@/lib/client";
const supabase = createClient(); // synchronous
```

**Why**: Server client handles cookie-based session refresh with Next.js headers. Client variant uses browser storage.

### 2. Server-to-Client Layout Pattern

Dashboard uses server-client composition to handle auth on server while enabling client interactivity:

```tsx
// app/dashboard/layout.tsx (Server Component)
export default async function DashboardLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // ... fetch profile, check permissions
  return (
    <DashboardLayoutClient user={user} profile={profile}>
      {children}
    </DashboardLayoutClient>
  );
}
```

See `app/dashboard/layout.tsx` + `components/dashboard-layout-client.tsx` for reference implementation.

### 3. Permission Checks

Always verify permissions before rendering UI or processing mutations:

```tsx
import { hasPermission } from "@/lib/permissions";

// In Server Components
if (!hasPermission(profile?.role, "articles", "create")) {
  redirect("/dashboard");
}

// In render logic
{
  canCreate && <Button>New Article</Button>;
}
```

Check `lib/permissions.ts` for all resource/action mappings.

### 4. Form Pattern with Router Refresh

Client forms follow this pattern (see `components/article-form.tsx`):

```tsx
const router = useRouter();
const supabase = createClient();

const handleSubmit = async (e) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // ... perform mutation
  router.push("/dashboard/articles");
  router.refresh(); // ⚠️ Critical: revalidates server component cache
};
```

Always call `router.refresh()` after mutations to sync server data.

## Database Schema

Managed via numbered SQL migrations in `scripts/`. Key tables:

- `profiles` - extends auth.users with role, full_name
- `articles` - MEDTimes content with RLS policies; supports both HTML content and PDF uploads (`article_type`, `pdf_url`, `pdf_s3_key`)
- `team_members` - Executive board + country representatives + collaborators (has `section` field: `executive_board`, `country_representatives`, `collaborators`)
- `media_library` - Hybrid storage: base64-encoded images OR S3-hosted files (`s3_key`, `s3_url`, `file_size`, `uploaded_by`)
- `hero_slides` - Homepage carousel with image/video support
- `award_blocks`, `canvas_page_elements` - Awards page builder system with video support
- `collaborator_images` - Homepage collaborator carousel images
- `events_submenu` - Dynamic navigation links for Events dropdown

Run new migrations directly in Supabase SQL editor in sequence (currently up to `023_create_events_submenu.sql`).

## Development Workflow

```bash
npm run dev         # Start dev server on :3000
npm run build       # Production build
npm run lint        # ESLint check
```

**No test suite currently exists.** Test manually using accounts in `TEST_USERS.md` (4 roles × multiple users).

## Component Conventions

### Rich Text Editor

Use `components/rich-text-editor.tsx` for WYSIWYG content (articles, nominations). It uses `contentEditable` with `document.execCommand` - output is raw HTML strings stored in DB.

### Media Selector

`components/media-selector.tsx` fetches from `media_library` table and displays images (base64 or S3-hosted). Used in article forms, hero slides, awards canvas. Automatically handles both storage types.

### Canvas Page Builder

`components/canvas-page-builder.tsx` is a drag-and-drop visual editor storing absolutely positioned elements in `canvas_page_elements` table. Elements have `x_position`, `y_position`, `z_index`, `rotation`, `opacity`. Supports images and videos.

### File Upload Components

- **`pdf-upload.tsx`** - Parse PDF content to HTML using `pdf-parser.ts` (for content extraction)
- **`pdf-s3-upload.tsx`** - Direct PDF upload to S3/MinIO for embedded display
- **`direct-s3-upload-dialog.tsx`** - Generic S3 file uploader for media library (images/videos)
- **`media-upload-dialog.tsx`** - Legacy base64 image uploader (still used for smaller images)

Use S3-based uploads (`lib/s3.ts`) for large files (videos, PDFs, high-res images). Use base64 for small icons/thumbnails.

### Submenu Managers

- **`events-submenu-manager.tsx`** - CRUD interface for dynamic Events navigation (admin dashboard)
- **`awards-submenu-manager.tsx`** - CRUD interface for dynamic Awards navigation (admin dashboard)

## Route Organization

```
app/
  ├── page.tsx                    # Public homepage (hero slides + collaborator carousel)
  ├── medtimes/                   # Public article listing + [slug] detail (supports HTML & PDF)
  ├── team/                       # Public team directory (exec/country reps/collaborators)
  ├── awards/                     # Public awards info page
  ├── medculture/                 # MEDCulture project initiative page
  ├── medlove/                    # MEDLove project initiative page
  ├── mednature/                  # MEDNature project initiative page
  ├── medshop/                    # MEDShop coming soon page
  ├── auth/login/                 # Supabase email/password auth
  └── dashboard/                  # Protected area (Server Component layout)
      ├── articles/               # CRUD for articles (journalists/admins) - HTML or PDF
      ├── team/                   # CRUD for team members (admins only)
      ├── media/                  # Media library management (base64 + S3)
      ├── hero-slides/            # Homepage carousel editor (image + video support)
      ├── awards/                 # Awards page builder + submissions (video support)
      ├── events-submenu/         # Dynamic events navigation manager (admins only)
      └── settings/               # User profile + (admin) user management
```

## Styling & UI

- **Tailwind CSS** with custom config (`tailwind.config.ts`)
- **shadcn/ui** components in `components/ui/` - all client components
- Primary color: `#193fa6` (blue), accent: `#D4AF37` (gold)
- Responsive with mobile-first approach

## Authentication Flow

1. User visits `/dashboard/*` → middleware checks auth
2. No session → redirect to `/auth/login`
3. After login → Supabase callback → middleware creates session
4. Members redirected to `/` (public), staff roles access dashboard
5. Layout fetches profile + checks role-specific permissions

## Public Project Pages

The app includes static landing pages for MDIO project initiatives:

- **`/medculture`** - medCULTURE initiative (#MEDCULTURE challenge)
- **`/medlove`** - medLOVE social effort (#MEDLOVE challenge)
- **`/mednature`** - medNATURE environmental initiative (#MEDNATURE challenge)
- **`/medshop`** - Coming soon page for merchandise store

These are static client components with custom theming (blue for culture, pink for love, teal for nature, gold for shop). No CMS integration currently - content is hardcoded.

## Common Pitfalls

- ❌ Using `createClient` from wrong path (server vs client)
- ❌ Forgetting `"use client"` on interactive components
- ❌ Not calling `router.refresh()` after Server Component data changes
- ❌ Hardcoding role checks instead of using `hasPermission()`
- ❌ Missing `await` when calling server `createClient()`
- ❌ Using base64 upload for large files (>1MB) - use S3 instead
- ❌ Not handling both `article_type` values when querying articles (`content` vs `pdf`)
- ❌ Forgetting to clean up S3 files on delete (call `deleteFromS3(s3_key)`)
- ❌ Missing environment variables for S3 (check `.env.local` has all `S3_*` vars)

## External Dependencies

- **Supabase** (auth + PostgreSQL): Credentials in env vars `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **S3/MinIO** (object storage): Configure via `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`, `S3_PUBLIC_URL` (see `lib/s3.ts`)
- **Vercel Analytics**: Pre-configured via `@vercel/analytics`
- **Lucide React**: Icon library (use semantic names)
- **React Hook Form + Zod**: Form validation (see article/team forms)
- **pdf-parse**: Server-side PDF text extraction (`lib/pdf-parser.ts`)
- **@aws-sdk/client-s3** + **@aws-sdk/lib-storage**: S3 client library

### S3/MinIO Integration

The app supports hybrid file storage:
1. **Base64** in database (legacy, for small images)
2. **S3/MinIO** for large files (videos, PDFs, high-res images)

When `S3_ENDPOINT` is configured, use `uploadToS3()`, `deleteFromS3()`, and `generateS3Key()` from `lib/s3.ts`. Files are stored with public-read ACL at `{S3_PUBLIC_URL}/{bucket}/{key}`.
