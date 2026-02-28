# XRKR80HD Studio - Local Handoff Notes

Date: 2026-02-28
Project path: /Users/xrkr80hd/Desktop/vs code projects/website - update/studio-production-suite

## 1) What is already pushed to GitHub (`main`)

Latest pushed commit:
- `248415e` - Add owner dashboard controls for home, tracks, and admin CRUD

Key pushed features include:
- Owner-only route protection for:
  - `/hub`
  - `/admin/users`
  - `/admin/home`
  - `/admin/tracks`
  - owner APIs for users/site-profile/tracks
- Admin dashboard links for owner tools:
  - Homepage controls
  - Tracks manager
  - Admin users
- Homepage now supports DB-driven card images (Legends/Scene/Podcast) from `site_profiles` fields.
- Owner tracks manager for CRUD, sorting, and home-player selection (`is_featured`).
- Owner homepage manager for landing profile image + card images.
- In-site admin user manager (`/admin/users`) with DB-backed admins.

## 2) New work completed locally (build passes, not pushed yet)

This local state includes additional completed work beyond `248415e`:
- Podcast model refactor from episode-only to podcast profiles + per-podcast episodes.
- Public podcast pages:
  - `/podcast` -> list podcast profiles
  - `/podcast/[slug]` -> podcast profile detail + latest episodes
- Admin podcast workflows:
  - `/admin/podcasts` -> CRUD podcast profiles
  - `/admin/podcasts/new` -> create profile
  - `/admin/podcasts/[slug]/edit` -> edit profile + CRUD episodes
- New podcast episode APIs (nested under podcast):
  - `/api/admin/podcasts/[slug]/episodes`
  - `/api/admin/podcasts/[slug]/episodes/[episodeId]`
- Upload reliability for `.mp3`:
  - Better MIME fallback by file extension
  - Configurable size limit via `UPLOAD_MAX_BYTES`
  - Default max upload increased to 200MB

## 3) Current local modified/untracked files (not pushed)

Modified:
- `.env.example`
- `README.md`
- `SUPABASE_ADMIN_SCHEMA_PATCH.md`
- `app/admin/podcasts/[slug]/edit/page.js`
- `app/admin/podcasts/new/page.js`
- `app/admin/podcasts/page.js`
- `app/api/admin/podcasts/[slug]/route.js`
- `app/api/admin/podcasts/route.js`
- `app/api/upload/route.js`
- `app/podcast/page.js`
- `components/AdminPodcastCrudForm.jsx`
- `lib/content.js`
- `composer.json` (unrelated Laravel-side local modification)

Untracked:
- `SUPABASE_ALL_TABLES_SCHEMA.md`
- `app/api/admin/podcasts/[slug]/episodes/`
- `app/podcast/[slug]/`
- `components/AdminPodcastEpisodesManager.jsx`
- `public/assets/bg/xrkr.favicon/` (local asset folder)

## 4) Build status

Latest local build status:
- `npm run build` passes.

## 5) Required Supabase SQL state

You already ran full schema bootstrap once successfully.

For the latest podcast profile + nested episodes model, ensure these exist:
- Table: `public.podcasts`
- Columns on `public.podcast_episodes`:
  - `podcast_id bigint references public.podcasts(id) on delete cascade`
  - `sort_order integer default 0`

Source doc:
- `SUPABASE_ADMIN_SCHEMA_PATCH.md`
- `SUPABASE_ALL_TABLES_SCHEMA.md`

## 6) Upload settings for audio

Supabase Storage bucket (`uploads`) should be:
- Public bucket: ON
- Restrict file size: OFF (or >= 200MB)
- Restrict MIME types: OFF

If MIME restriction is enabled, include at least:
- `audio/mpeg`
- `audio/mp4`
- `audio/wav`
- `audio/ogg`
- `audio/flac`

Env vars:
- `SUPABASE_STORAGE_BUCKET=uploads`
- `UPLOAD_MAX_BYTES=209715200`

## 7) Deploy checklist (next)

1. Commit local pending changes.
2. Push to `main`.
3. Ensure Supabase SQL patch for podcasts is applied.
4. Trigger Vercel redeploy (or auto-deploy from push).
5. Verify in production:
   - `/admin/podcasts` profile CRUD
   - `/admin/podcasts/[slug]/edit` episode CRUD
   - `/podcast` and `/podcast/[slug]`
   - track `.mp3` uploads from `/admin/tracks`

