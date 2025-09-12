## Overview

FiloMento is a content-driven website built with Next.js App Router and a minimal admin CMS. Content is stored in `data/content.json` (filesystem) or directly in a GitHub repository when configured. The admin interface allows editing page sections, managing uploads, and publishing changes via a simple JSON schema.

## Tech stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4
- Radix UI primitives (navigation, dropdown)

## Run locally

```bash
npm install
npm run dev
```

Site: `http://localhost:3000`

Admin: `http://localhost:3000/admin` (see Authentication and ENV below)

## Project layout (key paths)

```text
src/
  app/
    admin/                 # Admin UI pages
      content/page.tsx     # Visual content editor
      dashboard/page.tsx   # Overview + quick actions
      login/page.tsx       # Password login
      page.tsx             # Redirect to login
    api/
      admin/content/route.ts  # GET pages, POST full content map
      admin/upload/route.ts   # POST file upload (auth required)
      auth/login/route.ts     # POST set auth cookie
      auth/logout/route.ts    # POST clear cookie
    [public pages]/...      # e.g., bemutatkozas, tanaroknak, jelentkezes, kapcsolat
  components/
    admin/AdminLayout.tsx  # Admin header + auth gate
    DynamicPage.tsx        # Renders page sections
  lib/
    cms.ts                 # File/GitHub content storage and schema
    auth.ts                # Cookie-based auth helpers
data/
  content.json             # Content map (created on first run if absent)
public/uploads/            # Uploaded images (or stored in GitHub when configured)
```

## Content model (lib/cms.ts)

Pages are identified by `id` and consist of ordered `sections`. Supported section types and key fields:

- `hero`: `title`, `subtitle`
- `text`: `title`, `content`
- `highlight`: `title`, `content`, `isHighlighted`
- `info-box`: `content`
- `button`: `buttonText`, `buttonLink`
- `embed`: `embedUrl`, `height`
- `image`:
  - `imageUrl`: string
  - `description?`: string (small grey caption under image)
  - `imageWidth?`: number (px)
  - `imageHeight?`: number (px, optional; auto-scales if omitted)

Renderer: `components/DynamicPage.tsx` lays out these blocks. Images include built‑in vertical margins and captions, and do not render grey dividers around them.

## Admin CMS flow

1. Login at `/admin/login` with `ADMIN_PASSWORD`. On success, an httpOnly cookie `admin-auth` is set.
2. Content editor (`/admin/content`) fetches all pages via `GET /api/admin/content`.
3. Changes are saved by POSTing the entire updated content map to `POST /api/admin/content`.
4. Uploads go to `POST /api/admin/upload` and are written to `public/uploads/` or to the configured GitHub repo.

Admin header contains: Preview, Back to Dashboard, Logout.

## Environment variables

- `ADMIN_PASSWORD` (required): password used at `/api/auth/login`.
- `GITHUB_TOKEN` (optional): GitHub token for content persistence.
- `GITHUB_REPO` (optional): `owner/repo` target for CMS writes.
- `GITHUB_BRANCH` (optional): branch for writes, default `main`.

Persistence modes:

- No GitHub envs → read/write JSON files under `data/` and `public/uploads/`.
- With GitHub envs → content and uploads are committed to the repo via GitHub Content API (see `lib/cms.ts`).

## API quick reference

- `POST /api/auth/login` → `{ password }` → sets `admin-auth` cookie.
- `POST /api/auth/logout` → clears cookie.
- `GET /api/admin/content` → `{ pages }` (auth required).
- `POST /api/admin/content` → body: full content map (auth required).
- `POST /api/admin/upload` → `multipart/form-data` `{ file }` → `{ url, path, filename }` (auth required).

## Security notes (important)

- Do not store plaintext passwords in the repo. Use `ADMIN_PASSWORD` env only.
- Current auth uses a simple cookie flag; consider upgrading to a signed session (e.g., `iron-session`) and adding CSRF/Origin checks for POST routes if security needs increase.
- On serverless/ephemeral hosts, configure GitHub CMS envs or content will not persist across deployments.

## Common tasks

- Add a new page
  1) Admin → Dashboard → "Új oldal létrehozása", or extend `defaultContent` in `lib/cms.ts`.
  2) Create a public route under `src/app/[page]/page.tsx` and fetch via `getPageContent('[page]')`.

- Add a new section type
  1) Extend `ContentSection` in `lib/cms.ts`.
  2) Update `AdminContentEditor` form in `src/app/admin/content/page.tsx`.
  3) Update `SectionRenderer` in `components/DynamicPage.tsx`.

- Change image presentation
  - Use `imageWidth` and optional `imageHeight` in the admin editor. Caption comes from `description`.

## Scripts

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

## Admin guide

For non-technical usage instructions, see `README_ADMIN.md`.
