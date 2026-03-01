import { NextResponse } from 'next/server';
import { clampText, toBoolean, toInteger, isValidMediaUrl } from '../../../../../../../lib/admin-crud-utils';
import { getSupabaseAdmin } from '../../../../../../../lib/supabase-admin';

export const runtime = 'nodejs';

function parseBandSlug(raw) {
  return String(raw || '').trim();
}

function parseTrackId(raw) {
  const id = Number.parseInt(String(raw || ''), 10);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }
  return id;
}

function normalizeStorageKey(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9._/-]/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^\/+|\/+$/g, '');
}

function getStorageKeyFromPublicUrl(value, bucket) {
  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }

  const withoutQuery = raw.split('?')[0];
  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = withoutQuery.indexOf(marker);
  if (markerIndex < 0) {
    return '';
  }

  const encodedKey = withoutQuery.slice(markerIndex + marker.length);
  try {
    return normalizeStorageKey(decodeURIComponent(encodedKey));
  } catch {
    return normalizeStorageKey(encodedKey);
  }
}

function buildBandTrackPayload(raw) {
  const title = clampText(raw?.title, 255);
  const description = String(raw?.description || '').trim();
  const audioUrl = String(raw?.audio_url || '').trim();
  const coverImageUrl = String(raw?.cover_image_url || '').trim();
  const sortOrder = toInteger(raw?.sort_order, 0, 0, 9999);
  const isPublished = raw?.is_published === undefined ? true : toBoolean(raw?.is_published);
  const includeInRadio = raw?.include_in_radio === undefined ? true : toBoolean(raw?.include_in_radio);

  if (!title) {
    return { ok: false, error: 'Track title is required.' };
  }
  if (!audioUrl) {
    return { ok: false, error: 'Audio URL is required.' };
  }
  if (!isValidMediaUrl(audioUrl) || !isValidMediaUrl(coverImageUrl)) {
    return { ok: false, error: 'Media URLs must start with https:// or /' };
  }

  return {
    ok: true,
    payload: {
      title,
      description: description || null,
      audio_url: audioUrl,
      cover_image_url: coverImageUrl || null,
      sort_order: sortOrder,
      is_published: isPublished,
      include_in_radio: includeInRadio,
    },
  };
}

async function findBandBySlug(supabase, slug) {
  return supabase.from('bands').select('id, slug').eq('slug', slug).limit(1).maybeSingle();
}

async function findBandTrackById(supabase, trackId) {
  return supabase.from('band_tracks').select('*').eq('id', trackId).limit(1).maybeSingle();
}

export async function PUT(request, { params }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const slug = parseBandSlug(params.slug);
  if (!slug) {
    return NextResponse.json({ error: 'Band slug is required.' }, { status: 400 });
  }
  const trackId = parseTrackId(params.trackId);
  if (!trackId) {
    return NextResponse.json({ error: 'Invalid track id.' }, { status: 400 });
  }

  const band = await findBandBySlug(supabase, slug);
  if (band.error) {
    return NextResponse.json({ error: band.error.message }, { status: 500 });
  }
  if (!band.data) {
    return NextResponse.json({ error: 'Band not found.' }, { status: 404 });
  }

  const existing = await findBandTrackById(supabase, trackId);
  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }
  if (!existing.data || Number(existing.data.band_id) !== Number(band.data.id)) {
    return NextResponse.json({ error: 'Track not found for this band.' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = buildBandTrackPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const update = await supabase.from('band_tracks').update(parsed.payload).eq('id', trackId).select('*').limit(1).maybeSingle();
  if (update.error) {
    return NextResponse.json({ error: update.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, item: update.data || null });
}

export async function DELETE(request, { params }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const slug = parseBandSlug(params.slug);
  if (!slug) {
    return NextResponse.json({ error: 'Band slug is required.' }, { status: 400 });
  }
  const trackId = parseTrackId(params.trackId);
  if (!trackId) {
    return NextResponse.json({ error: 'Invalid track id.' }, { status: 400 });
  }

  const band = await findBandBySlug(supabase, slug);
  if (band.error) {
    return NextResponse.json({ error: band.error.message }, { status: 500 });
  }
  if (!band.data) {
    return NextResponse.json({ error: 'Band not found.' }, { status: 404 });
  }

  const existing = await findBandTrackById(supabase, trackId);
  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }
  if (!existing.data || Number(existing.data.band_id) !== Number(band.data.id)) {
    return NextResponse.json({ error: 'Track not found for this band.' }, { status: 404 });
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';
  const audioKey = getStorageKeyFromPublicUrl(existing.data.audio_url, bucket);
  const coverKey = getStorageKeyFromPublicUrl(existing.data.cover_image_url, bucket);
  const keysToDelete = Array.from(new Set([audioKey, coverKey].filter(Boolean)));

  const deleted = await supabase.from('band_tracks').delete().eq('id', trackId);
  if (deleted.error) {
    return NextResponse.json({ error: deleted.error.message }, { status: 500 });
  }

  let storageWarnings = [];
  if (keysToDelete.length) {
    const removeResult = await supabase.storage.from(bucket).remove(keysToDelete);
    if (removeResult.error) {
      storageWarnings.push(`Track row deleted, but storage cleanup failed: ${removeResult.error.message}`);
    }
  }

  return NextResponse.json({
    ok: true,
    storage_cleanup: {
      attempted: keysToDelete.length,
      warnings: storageWarnings,
    },
  });
}
