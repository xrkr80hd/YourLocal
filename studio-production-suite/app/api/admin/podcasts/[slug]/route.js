import { NextResponse } from 'next/server';
import { slugify, clampText, toBoolean, isValidMediaUrl } from '../../../../../lib/admin-crud-utils';
import { getSupabaseAdmin } from '../../../../../lib/supabase-admin';

export const runtime = 'nodejs';

function topicColumnHelp() {
  return 'Run the SQL patch in SUPABASE_ADMIN_SCHEMA_PATCH.md to add podcast_episodes.topic.';
}

function formatDateTimeForDb(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return null;
  }

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function buildEpisodePayload(raw) {
  const title = clampText(raw?.title, 255);
  const slugInput = clampText(raw?.slug, 255);
  const topic = clampText(raw?.topic, 120);
  const summary = clampText(raw?.summary, 320);
  const description = String(raw?.description || '').trim();
  const audioUrl = String(raw?.audio_url || '').trim();
  const coverImageUrl = String(raw?.cover_image_url || '').trim();
  const publishedAt = formatDateTimeForDb(raw?.published_at);
  const isFeatured = toBoolean(raw?.is_featured);
  const isPublished = raw?.is_published === undefined ? true : toBoolean(raw?.is_published);

  if (!title) {
    return { ok: false, error: 'Podcast title is required.' };
  }
  if (!audioUrl) {
    return { ok: false, error: 'Audio URL is required.' };
  }
  if (!isValidMediaUrl(audioUrl) || !isValidMediaUrl(coverImageUrl)) {
    return { ok: false, error: 'Media URLs must start with https:// or /' };
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
      topic: topic || null,
      summary: summary || null,
      description: description || null,
      audio_url: audioUrl,
      cover_image_url: coverImageUrl || null,
      published_at: publishedAt,
      is_featured: isFeatured,
      is_published: isPublished,
    },
  };
}

async function findEpisodeBySlug(supabase, slug) {
  return supabase.from('podcast_episodes').select('*').eq('slug', slug).limit(1).maybeSingle();
}

async function ensureUniqueSlugForUpdate(supabase, baseSlug, id) {
  let counter = 1;
  let candidate = baseSlug;

  while (counter < 200) {
    const existing = await supabase.from('podcast_episodes').select('id').eq('slug', candidate).limit(1).maybeSingle();
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

  const response = await findEpisodeBySlug(supabase, slug);
  if (response.error) {
    const message = String(response.error.message || '');
    if (message.includes('topic')) {
      return NextResponse.json({ error: `${message} ${topicColumnHelp()}` }, { status: 500 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
  if (!response.data) {
    return NextResponse.json({ error: 'Podcast episode not found.' }, { status: 404 });
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

  const existing = await findEpisodeBySlug(supabase, slug);
  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }
  if (!existing.data) {
    return NextResponse.json({ error: 'Podcast episode not found.' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = buildEpisodePayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const slugResult = await ensureUniqueSlugForUpdate(supabase, parsed.slug, existing.data.id);
  if (!slugResult.ok) {
    return NextResponse.json({ error: slugResult.error }, { status: 500 });
  }

  const update = await supabase
    .from('podcast_episodes')
    .update({
      ...parsed.payload,
      slug: slugResult.slug,
    })
    .eq('id', existing.data.id)
    .select('id, slug')
    .limit(1)
    .maybeSingle();

  if (update.error) {
    const message = String(update.error.message || '');
    if (message.includes('topic')) {
      return NextResponse.json({ error: `${message} ${topicColumnHelp()}` }, { status: 500 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
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

  const existing = await findEpisodeBySlug(supabase, slug);
  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }
  if (!existing.data) {
    return NextResponse.json({ error: 'Podcast episode not found.' }, { status: 404 });
  }

  const deleted = await supabase.from('podcast_episodes').delete().eq('id', existing.data.id);
  if (deleted.error) {
    return NextResponse.json({ error: deleted.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
