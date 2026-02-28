# Track C Review Checklist (Codex Only)

Use this after Claude says the UI track is done.

## 1) Scope Guard
- [ ] Confirm no new project/app was scaffolded.
- [ ] Confirm work stayed in:
  - `/Users/xrkr80hd/Desktop/vs code projects/website - update/studio-production-suite`
- [ ] Confirm edits are limited to agreed files.

## 2) Build Gate
- [ ] Run `npm run build`.
- [ ] If build fails, block deploy and fix first.

## 3) Owner/Auth Guard
- [ ] Owner-only pages still protected:
  - `/hub`
  - `/admin/home`
  - `/admin/tracks`
  - `/admin/users`
- [ ] Lower-tier admins cannot access owner-only routes.

## 4) Mobile Dashboard QA
- [ ] `/admin` is clean on phone width (no jumbled unequal action boxes).
- [ ] Edit options are obvious and quick to tap.
- [ ] No giant scroll wall before finding key edit links.

## 5) Homepage Card Controls QA
- [ ] `/admin/home` can edit image URLs for:
  - [ ] Hub card
  - [ ] Legends card
  - [ ] Scene card
  - [ ] Podcast card
  - [ ] Contact card
- [ ] `/` reflects updated card images after save.

## 6) Band Image QA
- [ ] Band card image, banner image, and band photo update correctly.
- [ ] Replace-upload flow does not create endless new storage files for same slot.
- [ ] Admin sees updated image URL/state without manual hard refresh.

## 7) Tracks Upload QA
- [ ] `.mp3` upload works in `/admin/tracks`.
- [ ] Upload errors (if any) are specific/actionable.
- [ ] New uploaded track can be saved and played in preview.

## 8) Band Organization QA
- [ ] Bands stay grouped by genre.
- [ ] Bands are alphabetized within each genre group.
- [ ] Works for both archive and scene sections.

## 9) Podcast Model QA
- [ ] `/admin/podcasts` manages podcast profiles (not only episode list).
- [ ] `/admin/podcasts/[slug]/edit` supports episode CRUD for that podcast.
- [ ] `/podcast` and `/podcast/[slug]` render correctly.

## 10) Release Decision
- [ ] PASS: ready to commit/push/deploy.
- [ ] FAIL: list blockers and fix list before deploy.

