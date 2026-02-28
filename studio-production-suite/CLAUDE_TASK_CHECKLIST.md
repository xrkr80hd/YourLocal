# Claude Task Checklist (XRKR80HD Studio)

Use this as the execution checklist for the current Next.js app in:
`/Users/xrkr80hd/Desktop/vs code projects/website - update/studio-production-suite`

## Goal
Fix admin UX + media handling issues fast, with clean mobile behavior and no broken routes.

## Constraints
- Keep owner-only restrictions in place (`xrkradmin` for owner tools).
- Do not expose backend CRUD on public pages.
- Build must pass (`npm run build`).
- Keep existing data safe; use additive SQL changes.

## Priority Checklist

## 1) Mobile Admin Dashboard Cleanup
- [ ] Replace current button jumble on `/admin` with a uniform tile/grid layout.
- [ ] Ensure equal-height action cards on mobile and desktop.
- [ ] Keep clear sections: `Edit Panels` and `Supabase Tools`.
- [ ] Keep logout accessible inside the dashboard.

Acceptance:
- [ ] On phone width, picking edit routes is easy and visually organized.
- [ ] No mixed button heights or unpredictable wrapping.

## 2) Homepage Card Photo Controls (Owner)
- [ ] Add owner-editable fields in `/admin/home` for:
  - [ ] Site Guide Hub card image
  - [ ] Legends card image
  - [ ] Scene card image
  - [ ] Podcast card image
  - [ ] Contact card image
- [ ] Wire these fields to `site_profiles` columns and save API.
- [ ] Update homepage card mapping in `app/page.js`.

Acceptance:
- [ ] Owner can change all guide card images from dashboard.
- [ ] Changes display on homepage after save (no code edit required).

## 3) Universal Image Sizing
- [ ] Standardize CSS sizes/aspect ratios for:
  - [ ] Band cards
  - [ ] Band page hero/banner
  - [ ] Band main photo
  - [ ] Home guide cards
- [ ] Ensure clean `object-fit: cover` behavior and no odd stretching.

Acceptance:
- [ ] Images look consistent across desktop/mobile.
- [ ] No giant/mini mismatches between cards and detail pages.

## 4) Band Image Upload Refresh + Replace Behavior
- [ ] Make admin-uploaded band images update immediately in form preview/state.
- [ ] Implement overwrite option for band image slots (card/banner/photo) so updates can replace previous storage key instead of always creating new file.
- [ ] Keep safe fallback behavior for other upload fields.

Acceptance:
- [ ] User does not need manual hard refresh to see new image URL in admin flow.
- [ ] Band image replacements do not endlessly pile up unique files for the same slot.

## 5) Track Upload Reliability
- [ ] Verify `/api/upload` supports `.mp3` robustly (MIME fallback + size handling).
- [ ] Surface clear upload error messages in UI.
- [ ] Validate folder allowlist includes `audio/tracks`.

Acceptance:
- [ ] Track `.mp3` upload succeeds from `/admin/tracks`.
- [ ] If it fails, UI shows exact actionable error (size, folder, MIME, bucket).

## 6) Admin Edit Pages: Use Dropdown/Collapsible Sections
- [ ] Add collapsible sections (`details/summary`) to reduce long-form scrolling in:
  - [ ] Track editor
  - [ ] Band editor
  - [ ] Podcast profile + episode editor
- [ ] Keep primary fields open by default; secondary fields collapsed.

Acceptance:
- [ ] Phone editing is manageable without endless scrolling.

## 7) Bands Listing: Genre + Alphabetization
- [ ] In admin and public band listing contexts, keep genre grouping.
- [ ] Sort names alphabetically inside each genre group.
- [ ] Keep page/era separation (Legends vs Scene).

Acceptance:
- [ ] Bands are easy to scan by genre, then name.

## 8) SQL Patch Alignment
- [ ] Ensure SQL docs include all required columns/tables for current code:
  - [ ] `site_profiles` card image columns (hub + legends + scene + podcast + contact)
  - [ ] upload/track support columns already in use
  - [ ] podcast profile model (`podcasts`) and episode relation columns

Acceptance:
- [ ] Running SQL patch removes missing-column/table runtime errors.

## 9) Final Verification
- [ ] `npm run build` passes.
- [ ] Manual route checks:
  - [ ] `/admin`
  - [ ] `/admin/home`
  - [ ] `/admin/tracks`
  - [ ] `/admin/bands`
  - [ ] `/admin/podcasts`
  - [ ] `/podcast`
- [ ] Document any env/settings prerequisites in `README.md`.

## Suggested File Targets
- `app/admin/page.js`
- `app/globals.css`
- `components/AdminHomeSettingsForm.jsx`
- `app/api/admin/site-profile/route.js`
- `app/page.js`
- `components/MediaUrlInput.jsx`
- `app/api/upload/route.js`
- `components/AdminBandCrudForm.jsx`
- `components/AdminTracksManager.jsx`
- `components/BandGridPage.jsx`
- `SUPABASE_ADMIN_SCHEMA_PATCH.md`
- `SUPABASE_ALL_TABLES_SCHEMA.md`

