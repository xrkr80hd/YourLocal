# Parallel Execution Split (Codex + Claude)

Project root (only place to work):
`/Users/xrkr80hd/Desktop/vs code projects/website - update/studio-production-suite`

## Non-Negotiables
- Do **not** scaffold any new app/project.
- Do **not** run `create-next-app`.
- Do **not** create a second repo/folder.
- Only edit existing project files in-place.
- Build check command only: `npm run build` (from this folder).

## Track A: Codex (Backend + Media Reliability)

Goal: fix upload reliability, replace-in-place behavior, data shape, and API wiring.

Files owned by Codex:
- `app/api/upload/route.js`
- `components/MediaUrlInput.jsx`
- `app/api/admin/site-profile/route.js`
- `app/api/admin/bands/route.js`
- `app/api/admin/bands/[slug]/route.js`
- `app/api/admin/tracks/route.js`
- `app/api/admin/tracks/[id]/route.js`
- `lib/content.js`
- `SUPABASE_ADMIN_SCHEMA_PATCH.md`
- `SUPABASE_ALL_TABLES_SCHEMA.md`
- `README.md` (env + upload notes only)

Codex tasks:
- Add replace-upload mode for band image slots (card/banner/photo) to avoid storage bloat.
- Ensure immediate returned URL/state update in admin forms.
- Keep `.mp3` upload robust (MIME fallback, size limit, actionable errors).
- Add/verify DB columns used by homepage card controls and podcast profile model.
- Keep APIs backward-safe where possible.

## Track B: Claude (Frontend + Admin UX)

Goal: mobile-first admin usability and clean visual consistency.

Files owned by Claude:
- `app/admin/page.js`
- `app/admin/home/page.js`
- `app/admin/bands/page.js`
- `app/admin/tracks/page.js`
- `app/admin/podcasts/page.js`
- `components/AdminHomeSettingsForm.jsx`
- `components/AdminBandCrudForm.jsx`
- `components/AdminTracksManager.jsx`
- `components/AdminPodcastCrudForm.jsx`
- `components/AdminPodcastEpisodesManager.jsx`
- `components/BandGridPage.jsx`
- `components/BandDetail.jsx`
- `app/page.js`
- `app/globals.css`

Claude tasks:
- Mobile dashboard: clean uniform edit tiles/cards (no jumbled mixed button boxes).
- Add collapsible sections (`details/summary`) on long admin forms.
- Universal image size rules for cards/band photo/banner with consistent aspect ratios.
- Add controls for Site Guide Hub card and Contact card images in owner home controls UI.
- Keep band listing grouped by genre and alphabetized in each group.

## Track C: Codex (Final QA + Merge Gate)

Goal: independently verify Claude changes before deploy/push.

Track C owner:
- Codex only

Track C tasks:
- Review Claude diff for scope creep:
  - confirm no new project scaffolding
  - confirm only intended files were touched
- Route verification after merge:
  - `/admin`
  - `/admin/home`
  - `/admin/tracks`
  - `/admin/bands`
  - `/admin/podcasts`
  - `/podcast`
  - `/podcast/[slug]`
- Behavior checks:
  - mobile admin tiles are uniform and usable
  - home card image controls include hub + legends + scene + podcast + contact
  - band image updates show immediately in admin flow
  - track `.mp3` upload works
  - no owner-permission regressions
- Build gate:
  - run `npm run build` and block deploy on failure
- Produce final acceptance summary with:
  - pass/fail list
  - remaining issues
  - exact fix recommendations

## Conflict Avoidance
- Each track edits only its owned files.
- If cross-file change is needed, note it in commit message and notify before changing.
- No force-reset/revert of unrelated modified files.

## Integration Order
1. Codex finishes backend/API + schema docs.
2. Claude finishes UI/UX layer.
3. Pull/rebase once.
4. Run `npm run build`.
5. Smoke test routes:
   - `/admin`
   - `/admin/home`
   - `/admin/tracks`
   - `/admin/bands`
   - `/admin/podcasts`
   - `/podcast`
   - `/podcast/[slug]`

## Done Criteria
- Build passes.
- Track `.mp3` upload works in `/admin/tracks`.
- Band image updates apply without manual refresh requirement in admin flow.
- Dashboard/mobile edit experience is organized and consistent.
- Owner can edit all homepage guide card images, including Hub + Contact.
