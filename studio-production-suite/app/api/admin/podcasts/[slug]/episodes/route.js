import { NextResponse } from 'next/server';
import { slugify, clampText, toBoolean, toInteger, isValidMediaUrl } from '../../../../../../lib/admin-crud-utils';
import { getSupabaseAdmin } from '../../../../../../lib/supabase-admin';

export const runtime = 'nodejs';

const OPTIONAL_EPISODE_COLUMNS = ['guest_names', 'episode_number', 'show_notes', 'is_explicit', 'include_in_radio'];

function episodesPatchHelp() {
  return 'Apply the latest Supabase schema SQL for this project to add podcast_episodes.podcast_id and podcast_episodes.sort_order.';
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
  const guestNames = clampText(raw?.guest_names, 255);
  const episodeNumberRaw = String(raw?.episode_number ?? '').trim();
  const episodeNumber = episodeNumberRaw === '' ? null : toInteger(episodeNumberRaw, 0, 0, 99999);
  const summary = clampText(raw?.summary, 320);
  const description = String(raw?.description || '').trim();
  const showNotes = String(raw?.show_notes || '').trim();
  const audioUrl = String(raw?.audio_url || '').trim();
  const coverImageUrl = String(raw?.cover_image_url || '').trim();
  const publishedAt = formatDateTimeForDb(raw?.published_at);
  const sortOrder = toInteger(raw?.sort_order, 0, 0, 9999);
  const isPublished = raw?.is_published === undefined ? true : toBoolean(raw?.is_published);
  const isExplicit = raw?.is_explicit === undefined ? false : toBoolean(raw?.is_explicit);
  const includeInRadio = raw?.include_in_radio === undefined ? true : toBoolean(raw?.include_in_radio);

  if (!title) {
    return { ok: false, error: 'Episode title is required.' };
  }
  if (!audioUrl) {
    return { ok: false, error: 'Audio URL is required.' };
  }
  if (!isValidMediaUrl(audioUrl) || !isValidMediaUrl(coverImageUrl)) {
    return { ok: false, error: 'Media URLs must start with https:// or /' };
  }

  const generatedSlug = slugify(slugInput || title);
  if (!generatedSlug) {
    return { ok: false, error: 'A valid episode slug is required.' };
  }

  return {
    ok: true,
    slug: generatedSlug,
    payload: {
      title,
      guest_names: guestNames || null,
      episode_number: episodeNumber,
      summary: summary || null,
      description: description || null,
      show_notes: showNotes || null,
      audio_url: audioUrl,
      cover_image_url: coverImageUrl || null,
      published_at: publishedAt,
      sort_order: sortOrder,
      is_published: isPublished,
      is_explicit: isExplicit,
      include_in_radio: includeInRadio,
    },
  };
}

async function findPodcastBySlug(supabase, slug) {
  return supabase.from('podcasts').select('id, slug').eq('slug', slug).limit(1).maybeSingle();
}

async function ensureUniqueEpisodeSlug(supabase, baseSlug, currentId = null) {
  let counter = 1;
  let candidate = baseSlug;

  while (counter < 200) {
    const existing = await supabase.from('podcast_episodes').select('id').eq('slug', candidate).limit(1).maybeSingle();
    if (existing.error) {
      return { ok: false, error: existing.error.message };
    }
    if (!existing.data || (currentId && Number(existing.data.id) === Number(currentId))) {
      return { ok: true, slug: candidate };
    }

    counter += 1;
    candidate = `${baseSlug}-${counter}`;
  }

  return { ok: false, error: 'Could not generate unique episode slug.' };
}

async function listEpisodes(supabase, podcastId) {
  const withSort = await supabase
    .from('podcast_episodes')
    .select('*')
    .eq('podcast_id', podcastId)
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (!withSort.error) {
    return { items: withSort.data || [], error: null };
  }

  const message = String(withSort.error.message || '');
  if (!message.includes('sort_order')) {
    return { items: [], error: message };
  }

  const fallback = await supabase
    .from('podcast_episodes')
    .select('*')
    .eq('podcast_id', podcastId)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (fallback.error) {
    return { items: [], error: fallback.error.message };
  }

  return { items: (fallback.data || []).map((item) => ({ ...item, sort_order: 0 })), error: null };
}

export async function GET(request, { params }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const slug = String(params.slug || '').trim();
  const podcast = await findPodcastBySlug(supabase, slug);
  if (podcast.error) {
    return NextResponse.json({ error: podcast.error.message }, { status: 500 });
  }
  if (!podcast.data) {
    return NextResponse.json({ error: 'Podcast not found.' }, { status: 404 });
  }

  const result = await listEpisodes(supabase, podcast.data.id);
  if (result.error) {
    const message = String(result.error || '');
    if (message.includes('podcast_id')) {
      return NextResponse.json({ error: `${message} ${episodesPatchHelp()}` }, { status: 500 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ items: result.items });
}

export async function POST(request, { params }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const slug = String(params.slug || '').trim();
  const podcast = await findPodcastBySlug(supabase, slug);
  if (podcast.error) {
    return NextResponse.json({ error: podcast.error.message }, { status: 500 });
  }
  if (!podcast.data) {
    return NextResponse.json({ error: 'Podcast not found.' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = buildEpisodePayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const slugResult = await ensureUniqueEpisodeSlug(supabase, parsed.slug);
  if (!slugResult.ok) {
    return NextResponse.json({ error: slugResult.error }, { status: 500 });
  }

  const baseInsertPayload = {
    ...parsed.payload,
    podcast_id: podcast.data.id,
    slug: slugResult.slug,
  };

  let insert = await supabase
    .from('podcast_episodes')
    .insert(baseInsertPayload)
    .select('id, slug')
    .limit(1)
    .maybeSingle();

  if (insert.error) {
    const message = String(insert.error.message || '');
    const retryPayload = { ...baseInsertPayload };
    let strippedAny = false;
    for (const column of OPTIONAL_EPISODE_COLUMNS) {
      if (message.includes(column)) {
        delete retryPayload[column];
        strippedAny = true;
      }
    }

    if (strippedAny) {
      insert = await supabase.from('podcast_episodes').insert(retryPayload).select('id, slug').limit(1).maybeSingle();
    }
  }

  if (insert.error) {
    const message = String(insert.error.message || '');
    if (message.includes('podcast_id') || message.includes('sort_order')) {
      return NextResponse.json({ error: `${message} ${episodesPatchHelp()}` }, { status: 500 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, item: insert.data });
}
