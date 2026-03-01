import { NextResponse } from 'next/server';
import { slugify, clampText, toBoolean, toInteger, isValidMediaUrl } from '../../../../../lib/admin-crud-utils';
import { getSupabaseAdmin } from '../../../../../lib/supabase-admin';

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

async function findPodcastBySlug(supabase, slug) {
  return supabase.from('podcasts').select('*').eq('slug', slug).limit(1).maybeSingle();
}

async function ensureUniqueSlugForUpdate(supabase, baseSlug, id) {
  let counter = 1;
  let candidate = baseSlug;

  while (counter < 200) {
    const existing = await supabase.from('podcasts').select('id').eq('slug', candidate).limit(1).maybeSingle();
    if (existing.error) {
      return { ok: false, error: existing.error.message };
    }
    if (!existing.data || Number(existing.data.id) === Number(id)) {
      return { ok: true, slug: candidate };
    }

    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return { ok: false, error: 'Could not generate a unique slug.' };
}

export async function GET(request, { params }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const slug = String(params.slug || '').trim();
  if (!slug) {
    return NextResponse.json({ error: 'Podcast slug is required.' }, { status: 400 });
  }

  const response = await findPodcastBySlug(supabase, slug);
  if (response.error) {
    const message = String(response.error.message || '');
    if (message.includes('public.podcasts')) {
      return NextResponse.json({ error: `${message} ${podcastsTableHelp()}` }, { status: 500 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
  if (!response.data) {
    return NextResponse.json({ error: 'Podcast not found.' }, { status: 404 });
  }

  return NextResponse.json({ item: response.data });
}

export async function PUT(request, { params }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const slug = String(params.slug || '').trim();
  if (!slug) {
    return NextResponse.json({ error: 'Podcast slug is required.' }, { status: 400 });
  }

  const existing = await findPodcastBySlug(supabase, slug);
  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }
  if (!existing.data) {
    return NextResponse.json({ error: 'Podcast not found.' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = buildPodcastPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const slugResult = await ensureUniqueSlugForUpdate(supabase, parsed.slug, existing.data.id);
  if (!slugResult.ok) {
    return NextResponse.json({ error: slugResult.error }, { status: 500 });
  }

  const update = await supabase
    .from('podcasts')
    .update({
      ...parsed.payload,
      slug: slugResult.slug,
    })
    .eq('id', existing.data.id)
    .select('id, slug')
    .limit(1)
    .maybeSingle();

  if (update.error) {
    return NextResponse.json({ error: update.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, item: update.data });
}

export async function DELETE(request, { params }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const slug = String(params.slug || '').trim();
  if (!slug) {
    return NextResponse.json({ error: 'Podcast slug is required.' }, { status: 400 });
  }

  const existing = await findPodcastBySlug(supabase, slug);
  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }
  if (!existing.data) {
    return NextResponse.json({ error: 'Podcast not found.' }, { status: 404 });
  }

  await supabase.from('podcast_episodes').delete().eq('podcast_id', existing.data.id);
  const deleted = await supabase.from('podcasts').delete().eq('id', existing.data.id);
  if (deleted.error) {
    return NextResponse.json({ error: deleted.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
