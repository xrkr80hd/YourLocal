# C2 Backend Endpoint-to-Endpoint Audit (Release Fast)

Owner: `C2 (Codex 2)`  
Created: `2026-02-18`  
Scope: Full backend verification before go-live for `studio-production-suite`

## Objective
Verify every critical backend endpoint from request -> validation -> DB write/read -> response render/redirect, with priority on admin write paths so release can ship safely ASAP.

## Non-Negotiable Rule (From Owner)
- Do **not** build anything new first.
- First, search current project files for existing database structure and logic.
- Use what already exists before adding migrations, models, or new backend code.
- Only add new backend code if a confirmed gap remains after file-level DB review.

### Required First Search (Before Any Code Changes)
Search these areas first:
- `database/migrations/`
- `app/Models/`
- `app/Http/Controllers/`
- `resources/views/admin/` (form field names must match controller + DB)

Run:

```bash
rg -n "bands|members_json|genre|banner_image_url|band_photo_url|is_solo_artist" app database resources/views
php artisan migrate:status
```

Pass criteria before coding:
- Existing DB columns and migrations are identified.
- Existing model casts/fillable are identified.
- Existing controller validation and form field names are mapped.

## Hard Release Blockers
- Any 500/exception on admin create/update/delete endpoints.
- Band edit/update failure for existing bands.
- Auth/session flow broken (`/admin/login` -> `/admin/dashboard` -> `/admin/logout`).
- Public routes returning 500 or broken model binding (`/bands/{slug}`, `/blog/{slug}`).

## Execution Order (Fastest Safe Path)
1. Environment + DB sanity.
2. Auth flow.
3. `bands` CRUD (highest risk and known issue).
4. Other admin CRUD endpoints (`tracks`, `projects`, `posts`, `podcasts`, `media`, `bio`, `upload`).
5. Public read endpoints.
6. Automated tests + log sweep.
7. Go/No-Go decision.

## 1) Environment + DB Sanity
Run in `studio-production-suite/`:

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan migrate:status
php artisan route:list --except-vendor
```

Pass criteria:
- No migration errors.
- Route list contains all expected public/admin endpoints.

## 2) Endpoint Inventory (Must Verify)

### Public Read Endpoints
- `GET /`
- `GET /contact`
- `GET /hub`
- `GET /music`
- `GET /projects`
- `GET /blog`
- `GET /blog/{post:slug}`
- `GET /media`
- `GET /podcast`
- `GET /local-legends-archive`
- `GET /your-local-scene`
- `GET /bands/{band:slug}`

### Admin Auth + Dashboard
- `GET /admin`
- `GET /admin/login`
- `POST /admin/login`
- `GET /admin/dashboard`
- `POST /admin/logout`

### Admin Bio
- `GET /admin/bio`
- `PUT /admin/bio`

### Admin Resource CRUD (all request methods)
- `tracks`: index, create, store, edit, update, destroy
- `podcasts`: index, create, store, edit, update, destroy
- `bands`: index, create, store, edit, update, destroy
- `projects`: index, create, store, edit, update, destroy
- `posts`: index, create, store, edit, update, destroy
- `media`: index, create, store, edit, update, destroy
- Upload endpoint: `POST /admin/upload`

## 3) Bands Endpoint-to-Endpoint Drill (P0)
For `admin.bands.*`, verify:
- `GET /admin/bands` loads list.
- `GET /admin/bands/create` form loads.
- `POST /admin/bands` creates record and redirects without exception.
- `GET /admin/bands/{id}/edit` loads existing data.
- `PUT|PATCH /admin/bands/{id}` updates existing record without exception.
- `DELETE /admin/bands/{id}` removes record and redirects cleanly.

Data cases to test:
- Full data payload with members and both image URLs.
- Minimal payload with optional fields empty.
- Solo artist (`is_solo_artist=true`) and non-solo artist.
- Genre from picklist and "other genre" path.
- Malformed `members_json` (must return validation error, not 500).

Required backend checks:
- Controller validation rules align with form payload.
- Model `$fillable` and `$casts` match schema and payload types.
- DB columns exist for all persisted fields (`banner_image_url`, `band_photo_url`, `is_solo_artist`, `members_json`, etc).
- Redirect + flash response is correct after update.

## 4) Quick Manual HTTP Validation
Use browser for full form flows and use this for fast smoke checks:

```bash
curl -I http://localhost:8000/
curl -I http://localhost:8000/hub
curl -I http://localhost:8000/podcast
curl -I http://localhost:8000/local-legends-archive
```

For authenticated endpoint checks, rely on browser session and confirm non-500 responses + expected redirects.

## 5) DB Integrity Verification After Writes
After each admin CRUD test:
- Confirm row created/updated/deleted in DB.
- Confirm timestamps update correctly.
- Confirm slug uniqueness and route model binding still resolves.
- Confirm no orphaned references (where applicable).

## 6) Logs and Error Sweep
During and after testing:

```bash
tail -n 200 storage/logs/laravel.log
```

Pass criteria:
- No uncaught exceptions from tested endpoints.
- No repeated warnings indicating data corruption or cast/validation mismatch.

## 7) Automated Test Gate
Run:

```bash
php artisan test
```

Minimum required:
- Existing tests pass, or failures are clearly unrelated and documented.
- Add/adjust feature tests for `admin.bands.update` if coverage is missing.

## 8) Go/No-Go Checklist
Go only if all are true:
- Band edit/update issue is fixed and reproducible no longer.
- All admin CRUD endpoints execute with no 500s.
- Public endpoints load with expected data and no binding errors.
- Logs are clean of critical backend exceptions.
- Test run is green or has documented non-blocking failures with owner/date.

## Reporting Format for C2
Provide a short release report with:
1. `PASS/FAIL` per endpoint group.
2. Exact failing endpoint + payload + exception (if any).
3. Files changed to fix issues.
4. Retest evidence after fix.
5. Final recommendation: `GO` or `NO-GO`.
