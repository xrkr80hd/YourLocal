# Studio Production Suite (Next.js)

This project now runs as a Next.js app with Supabase-backed content and storage.

## Local Run

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Open:

- `http://localhost:3000`

## Docker Run

```bash
docker compose up --build
```

Open `http://localhost:3000`.

## Environment Variables

Required for dynamic content and uploads:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional:

- `NEXT_PUBLIC_SUPABASE_URL` (falls back to `SUPABASE_URL`)
- `SUPABASE_STORAGE_BUCKET` (default: `uploads`)

## Upload Test Route

- `GET /upload` for a browser form
- `POST /api/upload` accepts multipart form uploads (`file`, optional `folder`)

Uploads are sent to Supabase Storage so files persist outside Docker and deploy environments.

## Main Public Routes

- `/`
- `/hub`
- `/your-local-scene`
- `/local-legends-archive`
- `/bands/[slug]`
- `/podcast`
- `/music`
- `/projects`
- `/blog`
- `/blog/[slug]`
- `/media`
- `/contact`
