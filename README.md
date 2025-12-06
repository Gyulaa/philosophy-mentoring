## Overview

FiloMento is a Next.js App Router project with a lightweight file/GitHub-backed CMS and an admin UI. Admins can create pages, edit content blocks, upload images, and fully manage the top navigation (add/toggle/reorder/delete). New pages are rendered dynamically and reachable by either their page id or the navigation `href`.

The application features a responsive design with separate desktop and mobile navigation menus that automatically sync with the CMS navigation settings.

## Tech stack

- Next.js 15.4.8 (App Router with Turbopack)
- React 19
- TypeScript 5
- Tailwind CSS v4
- Radix UI components

## Run locally

### Prerequisites

- Node.js (v20 or higher recommended)
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   
   Create a `.env.local` file in the project root:
   ```env
   ADMIN_PASSWORD=your-secure-password-here
   ```
   
   Replace `your-secure-password-here` with your desired admin password.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - **Main site**: `http://localhost:3000` (redirects to `/bemutatkozas`)
   - **Admin panel**: `http://localhost:3000/admin`
   - **Admin login**: Use the password from your `.env.local` file

### Optional: GitHub CMS Configuration

If you want to use GitHub for content persistence (instead of local files), add these to `.env.local`:

```env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPO=owner/repo-name
GITHUB_BRANCH=main
```

When GitHub envs are configured, content and uploads are committed to the repo via GitHub Content API. Without them, data is stored locally in `data/` and `public/uploads/`.

## Project structure

```text
src/
  app/
    [slug]/page.tsx        # Dynamic route: resolves slug via settings.navigation → id → renders content
    page.tsx               # Home page (redirects to /bemutatkozas)
    layout.tsx             # Root layout with header/footer and navigation
    admin/
      content/page.tsx     # Visual editor (sections, uploads, preview)
      dashboard/page.tsx   # Create pages; manage navigation (visibility/order/delete)
      login/page.tsx       # Password login
      page.tsx             # Admin redirect/landing
    api/
      admin/
        content/route.ts   # GET { pages } | POST { [id]: PageContent } (auth)
        upload/route.ts    # POST file upload (auth)
        settings/route.ts  # GET/POST SiteSettings (auth)
      auth/
        login/route.ts     # POST set auth cookie
        logout/route.ts    # POST clear cookie
  components/
    admin/
      AdminLayout.tsx      # Admin header + auth gate
    ui/                    # Radix UI component wrappers
      button.tsx
      dropdown-menu.tsx
      navigation-menu.tsx
    DynamicPage.tsx        # Renders content sections
    MobileMenu.tsx         # Responsive mobile navigation dropdown
  lib/
    cms.ts                 # CMS schema + persistence (file or GitHub)
    auth.ts                # Cookie auth helpers
    utils.ts               # Utility functions (cn, etc.)
data/
  content.json             # Page contents (auto-created/merged)
  settings.json            # SiteSettings incl. navigation (auto-created)
public/
  uploads/                 # Uploaded images (or stored in GitHub when configured)
  assets/                  # Static assets (banner.jpg, etc.)
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
- The navigation bar (both desktop header and mobile menu) is driven by `settings.navigation` (visible + sorted by `order`). Both menus automatically sync with CMS changes.
- Dynamic route `src/app/[slug]/page.tsx` resolves the requested path as:
  1) Find a `NavItem` whose `href` matches the path → use its `id` to load content
  2) Fallback: use the slug itself as `id`
- The home page (`/`) automatically redirects to `/bemutatkozas`.

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

## Environment variables

### Required

- `ADMIN_PASSWORD` - Password for accessing the admin panel

### Optional (GitHub CMS)

- `GITHUB_TOKEN` - GitHub personal access token with repo permissions
- `GITHUB_REPO` - Repository in format `owner/repo-name`
- `GITHUB_BRANCH` - Branch name (defaults to `main`)

### Persistence modes

- **Local mode** (no GitHub envs): JSON files under `data/` and local `public/uploads/`
- **GitHub mode** (with GitHub envs): Content and uploads are committed to the repo via GitHub Content API

**Note:** For production deployments on ephemeral hosts (like Vercel), use GitHub mode to persist changes.

## Troubleshooting

### New page URL shows only header/footer
- Ensure `settings.navigation` contains an item with `id` matching the page id and `href` matching the link you click
- The dynamic route resolves `href → id`; if `href` is custom, content must exist under that `id`
- Verify the page is marked as `visible: true` in the navigation settings

### New pages not appearing in mobile menu
- The mobile menu automatically syncs with `settings.navigation` - ensure new pages have `visible: true`
- Clear browser cache and refresh if changes don't appear immediately

### Uploads not visible
- Check the returned `url` from `/api/admin/upload` is stored in the image section
- On GitHub mode, verify the file is committed and accessible via raw URL
- Ensure the image URL path is correct (relative paths should start with `/uploads/`)

### Changes not persisting on deploy
- Configure GitHub envs in production; local JSON writes won't persist on ephemeral hosts
- Verify GitHub token has write permissions to the repository

### Admin login not working
- Ensure `ADMIN_PASSWORD` is set in `.env.local` (not `.env`)
- Restart the dev server after changing environment variables
- Check browser console for authentication errors

## Available scripts

```bash
npm run dev      # Start development server with Turbopack (http://localhost:3000)
npm run build    # Build production bundle
npm start        # Start production server (requires build first)
npm run lint     # Run ESLint
```

## Development notes

- The dev server uses Turbopack for faster builds and hot reloading
- Navigation changes are reflected immediately in both desktop and mobile menus
- Content changes are saved to `data/content.json` (local mode) or GitHub (GitHub mode)
- Image uploads are stored in `public/uploads/` (local mode) or committed to GitHub (GitHub mode)
