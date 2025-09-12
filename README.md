## Overview

FiloMento is a Next.js App Router project with a lightweight file/GitHub-backed CMS and an admin UI. Admins can create pages, edit content blocks, upload images, and fully manage the top navigation (add/toggle/reorder/delete). New pages are rendered dynamically and reachable by either their page id or the navigation `href`.

## Tech stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4

## Run locally

```bash
npm install
npm run dev
```

- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## Key structure

```text
src/
  app/
    [slug]/page.tsx        # Dynamic route: resolves slug via settings.navigation → id → renders content
    admin/
      content/page.tsx     # Visual editor (sections, uploads, preview)
      dashboard/page.tsx   # Create pages; manage navigation (visibility/order/delete)
      login/page.tsx       # Password login
    api/
      admin/content/route.ts   # GET { pages } | POST { [id]: PageContent } (auth)
      admin/upload/route.ts    # POST file upload (auth)
      admin/settings/route.ts  # GET/POST SiteSettings (auth)
      auth/login/route.ts      # POST set auth cookie
      auth/logout/route.ts     # POST clear cookie
  components/
    admin/AdminLayout.tsx  # Admin header + auth gate
    DynamicPage.tsx        # Renders sections
  lib/
    cms.ts                 # CMS schema + persistence (file or GitHub)
    auth.ts                # Cookie auth helpers
data/
  content.json             # Page contents (auto-created/merged)
  settings.json            # SiteSettings incl. navigation (auto-created)
public/uploads/            # Uploaded images (or stored in GitHub when configured)
```

## CMS data model

PageContent
- `id: string`
- `title: string`
- `sections: ContentSection[]`

ContentSection types and fields (Hungarian labels in the UI)
- `hero` (hero): `title`, `subtitle`
- `text` (szöveg): `title?`, `content?`
- `highlight` (kiemelés): `title?`, `content?`, `isHighlighted?`
- `info-box` (info-box): `content?`
- `button` (gomb): `buttonText?`, `buttonLink?`
- `embed` (űrlap beágyazás): `embedUrl?`, `height?`
- `image` (kép): `imageUrl?`, `description?`, `imageWidth?`, `imageHeight?`

SiteSettings
- `siteName`, `siteDescription`, `contactEmail`, `footerText`
- `navigation: NavItem[]` where `NavItem = { id, label, href, visible, order }`

Renderer
- `components/DynamicPage.tsx` renders `sections` in order.
- Images have built‑in vertical spacing; captions use `description`. No grey dividers around image blocks.

## How pages and nav work

- Creating a page (Admin → Dashboard → Új oldal létrehozása) writes a `PageContent` under `data/content.json` and appends a `NavItem` to `settings.navigation`.
- The navigation bar (both desktop header and preview in content) is driven by `settings.navigation` (visible + sorted by `order`).
- Dynamic route `src/app/[slug]/page.tsx` resolves the requested path as:
  1) Find a `NavItem` whose `href` matches the path → use its `id` to load content
  2) Fallback: use the slug itself as `id`

## Admin flows

- Content editor (`/admin/content`)
  - Choose page, edit sections, upload images, save
  - Preview button opens the correct URL based on navigation mapping
  - Section type labels shown in Hungarian

- Dashboard (`/admin/dashboard`)
  - Create page: id, optional title, optional link (normalized to start with `/`)
  - Navigation management: toggle visibility, move up/down (orders reindexed), delete page+nav via “Törlés”

## API quick reference

- `POST /api/auth/login` → `{ password }` → sets `admin-auth` cookie
- `POST /api/auth/logout` → clears cookie
- `GET /api/admin/content` → `{ pages }` (auth)
- `POST /api/admin/content` → body: full content map (auth)
- `POST /api/admin/upload` → `multipart/form-data` `{ file }` → `{ url, path, filename }` (auth)
- `GET /api/admin/settings` → `{ settings }` (auth)
- `POST /api/admin/settings` → merges incoming fields into `settings` (auth)

## Environment

- `ADMIN_PASSWORD` (required)
- `GITHUB_TOKEN`, `GITHUB_REPO` (`owner/repo`), `GITHUB_BRANCH` (optional; defaults to `main`)

Persistence modes
- No GitHub envs → JSON files under `data/` and local `public/uploads/`
- With GitHub envs → content and uploads are committed to the repo via GitHub Content API

## Troubleshooting

- New page URL shows only header/footer
  - Ensure `settings.navigation` contains an item with `id` matching the page id and `href` matching the link you click
  - The dynamic route resolves `href → id`; if `href` is custom, content must exist under that `id`

- Uploads not visible
  - Check the returned `url` from `/api/admin/upload` is stored in the image section
  - On GitHub mode, verify the file is committed and accessible via raw URL

- Changes not persisting on deploy
  - Configure GitHub envs in production; local JSON writes won’t persist on ephemeral hosts

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

For non-technical usage instructions (Hungarian), see `README_ADMIN.md`.
