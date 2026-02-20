# C2 Implementation Spec: Band Member Photo + Bio Modal

Owner: `C2 (Codex 2)`  
Status: `Ready to execute after current testing`  
Target app: `studio-production-suite/`

## Objective
Implement member-level profiles for each band with:
- member photo upload
- member short bio
- modal popup on band page click

## Constraints
- Do not create a new table first. Reuse `bands.members_json`.
- Keep backward compatibility with existing `members_json` data.
- No breaking changes to current band create/edit/update.

## Backend Tasks
1. Update `app/Http/Controllers/Admin/AdminBandController.php`:
   - Accept structured member payload (JSON string or array).
   - Validate member fields:
     - `name` required when row exists
     - `role` optional
     - `image_url` optional (must be URL or `/path`)
     - `bio_short` optional, max 320
     - `sort_order` optional integer
   - Keep legacy `members_text` parser as fallback.
   - Normalize and save to `members_json`.

2. Keep schema as JSON array in `bands.members_json`.
   - No migration unless absolutely required.

## Admin UI Tasks
1. Replace plain `members_text` block in:
   - `resources/views/admin/bands/form.blade.php`

2. Build structured member editor rows:
   - Name input
   - Role input
   - Photo URL input (`data-upload-kind="image"`)
   - Short bio textarea
   - Sort order input
   - Add/remove row controls

3. Add a hidden field to submit normalized JSON payload.

4. JS behavior:
   - Hydrate existing member data into rows.
   - Serialize rows into hidden JSON on submit.
   - Preserve upload widget compatibility.

## Public Band Page Tasks
1. Update:
   - `resources/views/bands/show.blade.php`
   - `public/app.css`

2. Render member cards with:
   - photo
   - name
   - role

3. Modal interaction:
   - click card -> open modal
   - large photo
   - short bio
   - close button
   - `Esc` closes
   - backdrop click closes

4. Accessibility:
   - proper `aria` labels/roles
   - focus returned to triggering card on close

## Test Tasks
1. Add feature tests:
   - band create/update persists structured members
   - legacy members still parse/render
   - malformed member payload fails validation (no 500)

2. Run:
   - `php artisan test`

## Acceptance Criteria
- Admin can add multiple members with image + short bio.
- Upload flow works for each member photo.
- Public band page shows cards and modal with bio.
- Existing band records without new fields still render cleanly.
- No regressions in bands CRUD or scene/archive rendering.

## Deliverables
1. Updated controller/view/css/test files.
2. Brief changelog entry in handoff notes.
3. PASS test output and manual verification notes.
