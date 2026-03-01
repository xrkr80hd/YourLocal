import { NextResponse } from 'next/server';
import { slugify, clampText, toBoolean, toInteger, isValidMediaUrl } from '../../../../lib/admin-crud-utils';
import { getSupabaseAdmin } from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';

function podcastsTableHelp() {
  return 'Apply the latest Supabase schema SQL for this project to create public.podcasts.';
}

function buildPodcastPayload(raw) {
  const title = clampText(raw?.title, 255);
  const slugInput = clampText(raw?.slug, 255);
  const hosts = clampText(raw?.hosts, 255);
  const topic = clampText(raw?.topic, 120);
  const summary = clampText(raw?.summary, 320);
  const description = String(raw?.description || '').trim();
  const coverImageUrl = String(raw?.cover_image_url || '').trim();
  const isPublished = raw?.is_published === undefined ? true : toBoolean(raw?.is_published);
  const sortOrder = toInteger(raw?.sort_order, 0, 0, 9999);

  if (!title) {
    return { ok: false, error: 'Podcast name is required.' };
  }
  if (!isValidMediaUrl(coverImageUrl)) {
    return { ok: false, error: 'Cover image URL must start with https:// or /' };
  }

  const generatedSlug = slugify(slugInput || title);
  if (!generatedSlug) {
    return { ok: false, error: 'A valid slug is required.' };
  }

  return {
    ok: true,
    slug: generatedSlug,
    payload: {
      title,
      hosts: hosts || null,
      topic: topic || null,
      summary: summary || null,
      description: description || null,
      cover_image_url: coverImageUrl || null,
      is_published: isPublished,
      sort_order: sortOrder,
    },
  };
}

async function ensureUniqueSlug(supabase, baseSlug) {
  let counter = 1;
  let candidate = baseSlug;

  while (counter < 200) {
    const existing = await supabase.from('podcasts').select('id').eq('slug', candidate).limit(1).maybeSingle();
    if (existing.error) {
      return { ok: false, error: existing.error.message };
    }
    if (!existing.data) {
      return { ok: true, slug: candidate };
    }

    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return { ok: false, error: 'Could not generate a unique slug.' };
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const response = await supabase
    .from('podcasts')
    .select('*')
    .order('topic', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true });

  if (response.error) {
    const message = String(response.error.message || '');
    if (message.includes('public.podcasts')) {
      return NextResponse.json({ error: `${message} ${podcastsTableHelp()}` }, { status: 500 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ items: response.data || [] });
}

export async function POST(request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = buildPodcastPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const slugResult = await ensureUniqueSlug(supabase, parsed.slug);
  if (!slugResult.ok) {
    return NextResponse.json({ error: slugResult.error }, { status: 500 });
  }

  const insert = await supabase
    .from('podcasts')
    .insert({
      ...parsed.payload,
      slug: slugResult.slug,
    })
    .select('id, slug')
    .limit(1)
    .maybeSingle();

  if (insert.error) {
    const message = String(insert.error.message || '');
    if (message.includes('public.podcasts')) {
      return NextResponse.json({ error: `${message} ${podcastsTableHelp()}` }, { status: 500 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, item: insert.data });
}
