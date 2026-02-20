# C2 Staged Feature: Band Member Profiles + Modal Bio

Owner: `C2 (Codex 2)`  
Status: `STAGED - DO NOT START UNTIL CURRENT TESTING/BUGFIX PHASE IS COMPLETE`  
Priority: `Post-test enhancement`

## Goal
Allow each band member to have:
- individual photo upload
- short bio
- role/name fields

Show member cards on band page, and open a modal on click with:
- larger photo
- short bio
- member details

## Do Not Start Until
- Current backend upload/API fixes are validated.
- Release blockers are cleared from:
  - `C2_BACKEND_ENDPOINT_AUDIT.md`
  - `C2_GO_LIVE_CHECKLIST.md`

## Scope

### 1) Data Model Update
Use/extend existing `bands.members_json` payload.

Target member schema:
```json
{
  "name": "Jane Doe",
  "role": "Vocals",
  "image_url": "/uploads/images/member-jane.jpg",
  "bio_short": "Front vocalist known for ...",
  "sort_order": 1
}
```

Requirements:
- Backward compatible with existing member rows that only have `name|role|image_url`.
- No migration required if `members_json` remains JSON object array and parser is upgraded safely.

### 2) Admin Band Form UX
Replace/upgrade current `members_text` workflow with structured member rows:
- `name` (required for row save)
- `role` (optional)
- `photo` upload (uses existing `/admin/upload`)
- `bio_short` textarea (max ~320 chars)
- `sort_order`

Admin actions:
- add member row
- remove member row
- reorder member rows

Validation:
- each member with data must include `name`
- `bio_short` max length enforced
- image URL format validated

### 3) Controller + Validation
Update:
- `app/Http/Controllers/Admin/AdminBandController.php`

Tasks:
- parse structured member payload from request
- normalize to `members_json`
- keep compatibility with legacy `members_text` fallback for old records during transition
- return clear validation errors (no 500s)

### 4) Public Band Page + Modal
Update:
- `resources/views/bands/show.blade.php`
- `public/app.css`

Behavior:
- render member cards with photo, name, role
- clicking card opens modal
- modal shows larger photo + short bio + close button
- keyboard + accessibility:
  - `Esc` closes modal
  - click backdrop closes modal
  - focus moves into modal and returns on close

Responsive:
- desktop: card grid
- tablet/mobile: stacked cards, modal fits viewport

### 5) Tests
Add/extend feature tests for:
- member profile data persists on band create/update
- legacy `members_json` still renders safely
- malformed member payload returns validation error, not exception

## Acceptance Criteria
- Admin can add multiple members with photo + short bio per member.
- Member photo uploads work from band admin form.
- Band page displays each member and opens modal with short bio.
- No regressions in band create/edit/update flow.
- Existing bands without `bio_short` still render correctly.

## Deliverables
1. Code changes in controller/view/css/tests.
2. Short migration/compatibility note (if needed).
3. QA checklist with screenshots:
   - admin add member
   - admin edit member
   - public modal open/close
