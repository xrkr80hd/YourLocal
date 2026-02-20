# Project Handoff - website update

Last updated: 2026-02-16

## Canonical Project
- Main app: `studio-production-suite/`
- Reference-only static build: `xrkr80hd.studio/xrkr.80hd.studio/`

## Runtime / Docker
- App URL: `http://localhost:8000`
- Container: `xrkr80hd-suite-app`
- Start/rebuild:
  - `cd '/Users/xrkr80hd/Desktop/vs code projects/website - update/studio-production-suite'`
  - `docker context use desktop-linux`
  - `docker compose up -d --build`
- Stop: `docker compose down`
- Logs: `docker compose logs -f`

## Admin Login
- URL: `http://localhost:8000/admin`
- Email: `admin@xrkr80hd.studio`
- Password: `changeme123!`

## What Is Implemented

### Branding / Navigation
- Current navbar order:
  - `Home`
  - `XRKR HUB`
  - `YourLocal Legends`
  - `YourLocal Scene`
  - `YourLocal Podcast`
- Mobile hamburger menu implemented.
- `XRKR HUB` styled neon yellow, `Home` styled contrasting neon tone.
- `Admin` removed from public navbar; admin is direct URL only (`/admin`).

### Hub
- Route: `http://localhost:8000/hub`
- Purpose: consolidated entry for Music / Projects / Blog / Media.
- Uses data from existing tables and links to each section.

### YourLocal Pages
- `http://localhost:8000/local-legends-archive`
- `http://localhost:8000/your-local-scene`
- Card system is in place and currently accepted by user as good.

### Band Profiles (Public + Admin)
- Public band page route: `http://localhost:8000/bands/{slug}`
- Improved layout added for individual band pages (banner area + better fitting profile layout).
- Members section added with circular member photos.

### Band Admin Enhancements
- Admin bands CRUD exists at `http://localhost:8000/admin/bands`
- Added fields:
  - `banner_image_url`
  - `band_photo_url`
  - `is_solo_artist`
  - `members_json` (via textarea parser)
- Genre handling now supports picklist + `other` text.

### Podcast Channel
- Public route: `http://localhost:8000/podcast`
- Admin CRUD: `http://localhost:8000/admin/podcasts`
- Seeded with sample episode.

### Home Profile / Bio
- Home headline defaults to `XRKR80HD`.
- Removed old "Retro Creator Hub" text.
- Admin-editable avatar/photo added in bio settings.

### Background Assets
- Imported local images into:
  - `studio-production-suite/public/assets/bg/`
- These images are used as container/hero texture backgrounds in CSS.

### Layout Standardization
- Featured Tracks / Featured Projects on home standardized to same container sizing.
- Masonry-style stacked layout (`stack-grid`) introduced for selected list sections.

## Database / Migrations Added
- `2026_02_16_030000_create_bands_table.php`
- `2026_02_16_031000_add_avatar_url_to_site_profiles_table.php`
- `2026_02_16_032000_create_podcast_episodes_table.php`
- `2026_02_16_040000_add_profile_fields_to_bands_table.php`

## Seed Data Added/Updated
- Site profile headline set to `XRKR80HD`
- Sample bands (archive + scene)
- Sample podcast episode

## Key Files Touched (High Value)
- `studio-production-suite/routes/web.php`
- `studio-production-suite/public/app.css`
- `studio-production-suite/resources/views/layouts/app.blade.php`
- `studio-production-suite/resources/views/home.blade.php`
- `studio-production-suite/resources/views/hub/index.blade.php`
- `studio-production-suite/resources/views/bands/index.blade.php`
- `studio-production-suite/resources/views/bands/show.blade.php`
- `studio-production-suite/resources/views/admin/bands/form.blade.php`
- `studio-production-suite/resources/views/layouts/admin.blade.php`
- `studio-production-suite/app/Http/Controllers/Admin/AdminBandController.php`
- `studio-production-suite/app/Http/Controllers/HubController.php`
- `studio-production-suite/app/Http/Controllers/PodcastController.php`
- `studio-production-suite/app/Http/Controllers/Admin/AdminPodcastEpisodeController.php`
- `studio-production-suite/app/Models/Band.php`
- `studio-production-suite/app/Models/PodcastEpisode.php`
- `studio-production-suite/database/seeders/DatabaseSeeder.php`

## Important Pending Item
- User requested: **"no pills anywhere"**.
- Most pill-like visuals were removed/reworked (brand badge and major UI chips), but do a final visual sweep for any remaining capsule-like treatments in all pages/components.

## Recommended Next Work (for Copilot)
1. Complete final "no pills anywhere" design sweep across all pages (public + admin).
2. Build richer XRKR HUB behavior requested earlier:
   - horizontal cards
   - dropdown population for Music/Media
   - blog container with internal scrollbar + date-sorted list
3. Expand band data model toward full scalable profile system:
   - track uploads per band
   - play/like/comment metrics model per song
   - artist-type conditional layouts (solo vs band) refinement
4. Add strong image upload pipeline (instead of URL-only) with standardized size validation.

