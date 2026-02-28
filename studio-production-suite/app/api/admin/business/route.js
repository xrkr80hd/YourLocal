import { NextResponse } from 'next/server';
import { clampText, toBoolean, toInteger, isValidMediaUrl } from '../../../../lib/admin-crud-utils';
import { getSupabaseAdmin } from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';

function tableHelp() {
  return 'Run the SQL patch in SUPABASE_ADMIN_SCHEMA_PATCH.md to create public.local_businesses.';
}

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

async function listBusinesses(supabase, includeSortOrder = true) {
  let query = supabase.from('local_businesses').select('*').order('name', { ascending: true });

  if (includeSortOrder) {
    query = supabase
      .from('local_businesses')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
  }

  return query;
}

function withSortFallback(items = []) {
  return items.map((item) => ({
    ...item,
    sort_order: Number.isFinite(Number(item?.sort_order)) ? Number(item.sort_order) : 0,
  }));
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const withSort = await listBusinesses(supabase, true);
  if (!withSort.error) {
    return NextResponse.json({ items: withSort.data || [] });
  }

  const message = String(withSort.error.message || '');
  if (message.includes('public.local_businesses')) {
    return NextResponse.json({ error: `${message} ${tableHelp()}` }, { status: 500 });
  }
  if (!message.includes('sort_order')) {
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const fallback = await listBusinesses(supabase, false);
  if (fallback.error) {
    return NextResponse.json({ error: fallback.error.message }, { status: 500 });
  }

  return NextResponse.json({
    items: withSortFallback(fallback.data || []),
  });
}

export async function POST(request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = buildBusinessPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const insert = await supabase.from('local_businesses').insert(parsed.payload).select('*').limit(1).maybeSingle();
  if (insert.error) {
    const message = String(insert.error.message || '');
    if (message.includes('public.local_businesses')) {
      return NextResponse.json({ error: `${message} ${tableHelp()}` }, { status: 500 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, item: insert.data || null });
}
