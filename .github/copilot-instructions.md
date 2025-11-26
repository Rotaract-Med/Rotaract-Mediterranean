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
- `articles` - MEDTimes content with RLS policies
- `team_members` - Executive board + country representatives (has `section` field)
- `media_library` - Base64-encoded images (see `006_update_media_library_for_base64.sql`)
- `hero_slides` - Homepage carousel
- `award_blocks`, `canvas_page_elements` - Awards page builder system

Run new migrations directly in Supabase SQL editor in sequence.

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

`components/media-selector.tsx` fetches from `media_library` table and displays base64-encoded images. Used in article forms, hero slides, awards canvas.

### Canvas Page Builder

`components/canvas-page-builder.tsx` is a drag-and-drop visual editor storing absolutely positioned elements in `canvas_page_elements` table. Elements have `x_position`, `y_position`, `z_index`, `rotation`, `opacity`.

## Route Organization

```
app/
  ├── page.tsx                    # Public homepage (hero slides)
  ├── medtimes/                   # Public article listing + [slug] detail
  ├── team/                       # Public team directory
  ├── awards/                     # Public awards info page
  ├── auth/login/                 # Supabase email/password auth
  └── dashboard/                  # Protected area (Server Component layout)
      ├── articles/               # CRUD for articles (journalists/admins)
      ├── team/                   # CRUD for team members (admins only)
      ├── media/                  # Media library management
      ├── hero-slides/            # Homepage carousel editor
      ├── awards/                 # Awards page builder + submissions
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

## Common Pitfalls

- ❌ Using `createClient` from wrong path (server vs client)
- ❌ Forgetting `"use client"` on interactive components
- ❌ Not calling `router.refresh()` after Server Component data changes
- ❌ Hardcoding role checks instead of using `hasPermission()`
- ❌ Missing `await` when calling server `createClient()`

## External Dependencies

- Supabase (auth + PostgreSQL): Credentials in env vars `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Vercel Analytics: Pre-configured via `@vercel/analytics`
- Lucide React: Icon library (use semantic names)
- React Hook Form + Zod: Form validation (see article/team forms)
