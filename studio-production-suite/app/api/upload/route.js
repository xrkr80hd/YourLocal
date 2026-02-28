import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '../../../lib/supabase-admin';

export const runtime = 'nodejs';

function cleanSegment(value) {
  return String(value || '')
    .trim()
    .replace(/\.+/g, '.')
    .replace(/[^a-zA-Z0-9._\/-]/g, '-')
    .replace(/\/+/g, '/');
}

function cleanFilename(value) {
  return String(value || 'file')
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(request) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const contentType = request.headers.get('content-type') || '';

  if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
    return NextResponse.json({ error: 'Content-Type must be multipart/form-data.' }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const folder = cleanSegment(formData.get('folder') || 'images').replace(/^\/+|\/+$/g, '');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
  }

  const maxBytes = 50 * 1024 * 1024;

  if (file.size > maxBytes) {
    return NextResponse.json({ error: 'File is larger than 50MB.' }, { status: 400 });
  }

  const filename = cleanFilename(file.name || 'upload.bin');
  const key = `${folder}/${Date.now()}-${randomUUID()}-${filename}`;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';
  const data = Buffer.from(await file.arrayBuffer());

  const upload = await supabase.storage.from(bucket).upload(key, data, {
    upsert: false,
    contentType: file.type || 'application/octet-stream',
  });

  if (upload.error) {
    return NextResponse.json({ error: upload.error.message }, { status: 500 });
  }

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(key);

  return NextResponse.json({
    key,
    bucket,
    url: publicData.publicUrl,
  });
}
