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

Use `components/rich-text-editor.tsx` (thin re-export of `components/editor/article-editor.tsx`) for WYSIWYG content (articles, nominations). It's Tiptap's official "Simple Editor" UI kit, added as editable source via `npx @tiptap/cli@latest add simple-editor` (MIT-licensed, not an npm package - lives in `components/tiptap-templates/`, `components/tiptap-ui/`, `components/tiptap-ui-primitive/`, `components/tiptap-node/`, `components/tiptap-icons/`, `hooks/use-*`, `lib/tiptap-utils.ts`, `styles/_variables.scss` + `_keyframe-animations.scss`). Don't hand-edit generated `tiptap-*` files unless customizing on purpose - re-running the CLI (`-o` to overwrite) will otherwise clobber changes.

On top of that base, `components/editor/article-editor.tsx` adds:
- `block-drag-handle.tsx` — Notion/Payload-style drag-to-reorder, using `@tiptap/extension-drag-handle-react` directly (the CLI's own `drag-context-menu` component hung indefinitely on its interactive prompt under piped/non-TTY stdin in this environment, so it's wired by hand instead - same underlying free/MIT extension either way). `computePositionConfig` is forced to `strategy: "fixed"` (the extension's default is `"absolute"`) - the handle portals into a wrapper near the editor's own DOM node rather than `document.body`, so with the default `absolute` strategy any `overflow-hidden` ancestor (this editor's own rounded-corner wrapper, the dashboard's `<main>`) clips it invisible.
- `block-library.ts` — single source of truth for the insertable block types (title/description/icon/keywords/`run`), shared by both insertion surfaces below so they can't drift apart.
- `slash-command.tsx` — a `/`-triggered popup version of the block library, built on `@tiptap/suggestion`, rendered with `components/ui/command.tsx` (shadcn's `cmdk` wrapper) to match the rest of the dashboard rather than Tiptap's own unstyled `SlashDropdownMenu`.
- `block-palette.tsx` + `block-drop-extension.ts` — a persistent sidebar version of the same block library (explicitly requested over the popup-only slash menu): drag an item into the document to insert/convert at the drop position, or click it to insert at the cursor. The drop side is a ProseMirror plugin keyed on a custom `application/x-tiptap-block-title` drag MIME type, so it only intercepts palette-originated drags and leaves file drops / DragHandle's own internal drags to their normal handlers. Hidden below `sm:` - falls back to the slash menu on narrow viewports.
- `table-button.tsx` — hand-rolled (the official registry has no table component), wired to `@tiptap/extension-table`'s `TableKit`.
- `image-upload.ts` — replaces the template's demo `handleImageUpload` (which just fakes a progress bar and returns a static placeholder image) with a real upload through the same S3 + `media_library` path as `/api/upload`. Wired to both the toolbar's upload button (via `ImageUploadNode`) and to `@tiptap/extension-file-handler` for drag/drop/paste of image files from outside the browser - the Simple Editor template doesn't include `FileHandler` by default, so that's added back here explicitly.

The template's `ThemeToggle` was removed (it flips `document.documentElement.classList` globally, and the app has no dark-mode strategy elsewhere - would have silently reskinned the whole dashboard). `styles/_variables.scss`'s `--tt-brand-color-*` tokens were re-pointed from Tiptap's default violet to the dashboard's `#193fa6` / `#2563eb` blue.

A further pass added free/MIT Tiptap extensions beyond the Simple Editor base: `text-color-button.tsx` (Color, reusing the vendor's pre-defined but previously-unused `--tt-color-text-*` palette), `@tiptap/extension-details` (toggle/collapsible blocks - renders as `div[data-type="details"]`, **not** a native `<details>`/`<summary>`, see `styles/tiptap-content.css`), `@tiptap/extension-code-block-lowlight` + `lowlight`'s `common` grammar bundle (syntax highlighting), `@tiptap/extension-table-of-contents` + `@tiptap/extension-unique-id` (`table-of-contents-panel.tsx`, a live outline in the sidebar), `@tiptap/extension-youtube` (block-library "Video" item, prompts for a URL), `emoji-command.tsx` (a `:`-triggered popup mirroring `slash-command.tsx`, using `gitHubEmojis` data from `@tiptap/extension-emoji` but inserting plain unicode text rather than a node), and `@tiptap/extension-focus` + `focus-mode-button.tsx` (dims non-focused blocks, off by default).

**Two extension-specific gotchas, both hit and fixed during that pass:**
- **Any object/array/function prop passed inline to `<DragHandle>` must be a stable, module-level reference.** `@tiptap/extension-drag-handle-react`'s internal `useEffect` depends on `computePositionConfig`/`nested`/etc. by identity; a fresh object literal on every render tears down and re-registers its ProseMirror plugin on every keystroke, which as a side effect of ProseMirror's plugin-view lifecycle **destroys every other plugin's view too** - this silently broke the slash-command and emoji-command popups (they'd start rendering, then get torn down within the same tick, every single time). See `COMPUTE_POSITION_CONFIG` in `block-drag-handle.tsx`.
- **`@tiptap/extension-details` does not render a native `<details>`/`<summary>` element** despite the name - it's a custom node view (`div[data-type="details"]` containing a toggle `<button>` and a `div[data-type="detailsContent"]` with a `hidden` attribute). CSS written against plain `details`/`summary` selectors silently matches nothing; use `openClassName: "is-open"` (configured in `article-editor.tsx`) as the state hook and see `styles/tiptap-content.css` for the actual selectors.

Shared content styling (toggle blocks, `.hljs-*` code token colors, YouTube iframe sizing, columns layout) lives in `styles/tiptap-content.css` - a plain global stylesheet imported by **both** `article-editor.tsx` and `components/article-body.tsx`, since the editor's own CSS module only affects the editing surface, not the saved HTML rendered on the public page.

Two more additions from a later pass:
- **Image resize handles** — `Image.configure({ resize: {...} })` in `article-editor.tsx` is a free, built-in feature of `@tiptap/extension-image` (`@tiptap/core`'s `ResizableNodeView`), not a Pro extension. It's easy to miss because it ships with **zero default visual styling** - the functional drag zones (`[data-resize-wrapper]`, `[data-resize-handle="left|right|top|bottom"]`) render as invisible, zero-size divs until you style them yourself. See the `[data-resize-*]` rules in `article-editor.module.scss` (editor-only; the published page just shows a plain sized `<img>`).
- **`columns-extension.ts`** — a hand-built two-column layout block (`Columns` node containing exactly two `Column` children, `content: "column column"`, both `isolating: true` so backspace can't merge them into each other). No official Tiptap extension covers this; the closest fit, `TableKit`, is built for tabular data and is a genuinely awkward way to just place two paragraphs or an image next to some text. Registry name is "Columns" in the block palette/slash menu. **Gotcha**: after `insertContent()`, the cursor lands after the *whole* inserted structure (in column 2), not inside column 1 where you'd expect to start typing - `setColumns()` explicitly repositions it via `setTextSelection(from + 2)`. That `+2` was found by resolving actual doc positions after insertion and checking their parent node type, not by reasoning about ProseMirror's position-counting rules from first principles - those didn't predict it correctly here, so if this node's schema ever changes, re-verify empirically rather than adjusting the arithmetic by feel.

Output is still raw HTML strings stored in DB, but it's sanitized with DOMPurify at render time via `lib/sanitize.ts` / `components/article-body.tsx` rather than trusted as-is.

Tiptap CLI note: `npx @tiptap/cli@latest add <component>` shows an unconditional "Press Enter to continue" prompt (`@inquirer/prompts`) with no non-interactive flag. Piping `yes "" | npx ...` gets past it (confirmed working for `add simple-editor`), but has also been observed hanging indefinitely at ~100% CPU with no progress on a subsequent `add drag-context-menu` call - if that happens, kill the process (safe; nothing is written until the file-list-printing phase starts) and either retry or install the underlying `@tiptap/extension-*` package directly with plain `npm install`.

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
