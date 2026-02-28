# Supabase Storage Mode Setup

Use this checklist any time you need to re-enable persistent uploads.

## 1. `.env` values

Set these in your app environment:

```env
SUPABASE_ENABLED=true
SUPABASE_URL=https://goufiujqycnkvewkvegq.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>

SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SUPABASE_STORAGE_ENABLED=true
SUPABASE_STORAGE_BUCKET=uploads
SUPABASE_STORAGE_PATH_PREFIX=uploads
```

Notes:
- `SUPABASE_SERVICE_ROLE_KEY` is required for server-side upload API calls.
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (server env only, never frontend).

## 2. Supabase bucket

In Supabase Storage:
- Create bucket: `uploads`
- If you want direct public image URLs, make the bucket public.

## 3. Apply config

After env changes:

```bash
php artisan config:clear
```

## 4. Verify

From Admin:
- Upload a band image.
- Confirm the saved URL looks like:
  - `https://<project-ref>.supabase.co/storage/v1/object/public/uploads/...`
- Reload band page and test click-to-expand photo.

