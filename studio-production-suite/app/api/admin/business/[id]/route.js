import { NextResponse } from 'next/server';
import { clampText, toBoolean, toInteger, isValidMediaUrl } from '../../../../../lib/admin-crud-utils';
import { getSupabaseAdmin } from '../../../../../lib/supabase-admin';

export const runtime = 'nodejs';

function isValidWebsiteUrl(value) {
  const url = String(value || '').trim();
  if (!url) {
    return true;
  }
  return /^(https?:\/\/|\/)/i.test(url);
}

function normalizeWebsiteUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }
  if (/^(https?:\/\/|\/)/i.test(raw)) {
    return raw;
  }
  return `https://${raw}`;
}

function parseBusinessId(rawId) {
  const id = Number.parseInt(String(rawId || ''), 10);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }
  return id;
}

function buildBusinessPayload(raw) {
  const name = clampText(raw?.name, 255);
  const category = clampText(raw?.category, 120);
  const summary = clampText(raw?.summary, 320);
  const description = String(raw?.description || '').trim();
  const logoUrl = String(raw?.logo_url || '').trim();
  const websiteUrl = normalizeWebsiteUrl(raw?.website_url);
  const isPublished = raw?.is_published === undefined ? true : toBoolean(raw?.is_published);
  const sortOrder = toInteger(raw?.sort_order, 0, 0, 9999);

  if (!name) {
    return { ok: false, error: 'Business name is required.' };
  }
  if (!isValidMediaUrl(logoUrl)) {
    return { ok: false, error: 'Logo image URL must start with https:// or /' };
  }
  if (!isValidWebsiteUrl(websiteUrl)) {
    return { ok: false, error: 'Website URL must start with https:// or /' };
  }

  return {
    ok: true,
    payload: {
      name,
      category: category || null,
      summary: summary || null,
      description: description || null,
      logo_url: logoUrl || null,
      website_url: websiteUrl || null,
      is_published: isPublished,
      sort_order: sortOrder,
    },
  };
}

async function findBusinessById(supabase, id) {
  return supabase.from('local_businesses').select('*').eq('id', id).limit(1).maybeSingle();
}

export async function GET(request, { params }) {
  const id = parseBusinessId(params.id);
  if (!id) {
    return NextResponse.json({ error: 'Invalid business id.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const response = await findBusinessById(supabase, id);
  if (response.error) {
    return NextResponse.json({ error: response.error.message }, { status: 500 });
  }
  if (!response.data) {
    return NextResponse.json({ error: 'Business not found.' }, { status: 404 });
  }

  return NextResponse.json({ item: response.data });
}

export async function PUT(request, { params }) {
  const id = parseBusinessId(params.id);
  if (!id) {
    return NextResponse.json({ error: 'Invalid business id.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const existing = await findBusinessById(supabase, id);
  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }
  if (!existing.data) {
    return NextResponse.json({ error: 'Business not found.' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = buildBusinessPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const update = await supabase.from('local_businesses').update(parsed.payload).eq('id', id).select('*').limit(1).maybeSingle();
  if (update.error) {
    return NextResponse.json({ error: update.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, item: update.data || null });
}

export async function DELETE(request, { params }) {
  const id = parseBusinessId(params.id);
  if (!id) {
    return NextResponse.json({ error: 'Invalid business id.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const existing = await findBusinessById(supabase, id);
  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }
  if (!existing.data) {
    return NextResponse.json({ error: 'Business not found.' }, { status: 404 });
  }

  const deleted = await supabase.from('local_businesses').delete().eq('id', id);
  if (deleted.error) {
    return NextResponse.json({ error: deleted.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
