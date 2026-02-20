# Go-Live Checklist (Assigned to C2)

Owner: `C2 (Codex 2)`  
Created: `2026-02-18`  
Project: `studio-production-suite/`

## Release Gate
- `BLOCKER`: Fix errors when editing bands after they are created.
- `BLOCKER`: Verify band create, edit, update, and delete flows in admin work with no exceptions.
- `BLOCKER`: Confirm public band pages still render correctly after admin edits.

## Priority Tasks
1. Reproduce and fix the band edit error.
2. Add validation and parsing hardening for band profile fields (`members_json`, genre + other genre, image URLs, solo artist toggle).
3. Add/update tests for admin band CRUD (especially update path).
4. Run full regression for music pages, hub links, and admin navigation.
5. Complete final "no pills anywhere" visual sweep across public + admin UI.
6. Verify podcast admin + public pages still work after latest changes.
7. Confirm homepage profile/bio edits save and render correctly.
8. Run migrations and seed checks in a clean environment.
9. Do final content sanity pass (broken links, missing images, bad slugs).
10. Prepare deployment notes and rollback plan.

## Detailed Checklist

### A) Band Edit Bug (Top Priority)
- Reproduce on `/admin/bands` with an existing record.
- Capture exact exception message, stack trace, and failing payload.
- Confirm whether failure is in controller validation, model casting, DB schema mismatch, or Blade form field naming.
- Patch fix in:
  - `app/Http/Controllers/Admin/AdminBandController.php`
  - `app/Models/Band.php`
  - `resources/views/admin/bands/form.blade.php`
  - related migration(s) if schema mismatch exists
- Verify:
  - update works with full band data
  - update works for solo artist
  - update works with empty/partial optional fields
  - update keeps existing values when fields are unchanged

### B) Validation + Data Integrity
- Enforce consistent validation rules for:
  - `name`, `slug`, `genre`, `other_genre`
  - `banner_image_url`, `band_photo_url`
  - `members_json`
  - `is_solo_artist`
- Ensure safe parsing for `members_json` input:
  - no fatal errors on malformed input
  - clear user-facing error message
- Confirm DB columns and model casts align with current form payload.

### C) Testing
- Add/adjust feature tests for:
  - admin band create
  - admin band update
  - admin band validation errors
  - public band show route
- Run test suite and note any unrelated failures.

### D) Visual + UX Final Sweep
- Remove any remaining pill/capsule UI elements.
- Check desktop + mobile on:
  - `/`
  - `/hub`
  - `/your-local-scene`
  - `/local-legends-archive`
  - `/podcast`
  - `/bands/{slug}`
  - `/admin/*`
- Confirm spacing, typography consistency, and no broken responsive layouts.

### E) Pre-Deploy Technical Checks
- Run fresh install path and verify app boots cleanly.
- Run migrations in clean DB and confirm no migration order issues.
- Confirm seeders complete without errors.
- Verify asset paths resolve and images load in production-like build.
- Confirm environment variables required for production are documented.

### F) Go-Live Readiness
- Update handoff/changelog with final fixes.
- Snapshot DB backup before release.
- Define rollback steps:
  - previous image/container tag
  - DB rollback strategy (if needed)
- Final sign-off checklist:
  - `C2` technical sign-off
  - stakeholder content sign-off
  - release timestamp + owner logged

## Definition of Done
- No errors when editing existing bands in admin.
- All critical routes load and function on desktop + mobile.
- Tests pass (or known non-blocking failures are documented with owner and follow-up date).
- Deployment + rollback instructions are documented and verified.
