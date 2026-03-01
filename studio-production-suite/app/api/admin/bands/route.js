import { NextResponse } from 'next/server';
import { parseBandProfilePayload, serializeBandProfilePayload } from '../../../../lib/band-profile';
import { slugify, clampText, toBoolean, toInteger, isValidMediaUrl } from '../../../../lib/admin-crud-utils';
import { normalizeSocialLinksMap } from '../../../../lib/social-platforms';
import { getSupabaseAdmin } from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';

function normalizeGenreList(value) {
  const source = Array.isArray(value) ? value : String(value || '').split(',');
  const cleaned = Array.from(
    new Set(
      source
        .map((item) => clampText(item, 80))
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
  return cleaned.slice(0, 12);
}

function normalizeMemberRoles(value) {
  const source = Array.isArray(value) ? value : String(value || '').split(/[\/,]/);
  return Array.from(
    new Set(
      source
        .map((item) => clampText(item, 80))
        .map((item) => item.trim())
        .filter(Boolean)
    )
  ).slice(0, 8);
}

function normalizeMembers(value) {
  const source = Array.isArray(value) ? value : [];
  const next = source
    .map((member) => {
      const imageUrl = String(member?.image_url || '').trim();
      const statusRaw = String(member?.status || '').trim().toLowerCase();
      const status = member?.is_past === true || statusRaw === 'past' || statusRaw === 'former' ? 'past' : 'current';
      const roles = normalizeMemberRoles(member?.roles || member?.role);
      const role = roles.join(' / ');

      return {
        name: clampText(member?.name, 120),
        role: role || null,
        roles,
        image_url: imageUrl,
        status,
      };
    })
    .filter((member) => member.name !== '' && (member.image_url === '' || isValidMediaUrl(member.image_url)));

  return next;
}

function buildBandPayload(raw, socialLinks) {
  const name = clampText(raw?.name, 255);
  const slugInput = clampText(raw?.slug, 255);
  const era = raw?.era === 'scene' ? 'scene' : 'archive';
  const yearsActive = clampText(raw?.years_active, 60);
  const genres = normalizeGenreList(raw?.genres || raw?.genre);
  const genre = clampText(genres[0] || raw?.genre, 80);
  const tagline = clampText(raw?.tagline, 180);
  const summary = clampText(raw?.summary, 320);
  const story = String(raw?.story || '').trim();
  const imageUrl = String(raw?.image_url || '').trim();
  const bannerImageUrl = String(raw?.banner_image_url || '').trim();
  const bandPhotoUrl = String(raw?.band_photo_url || '').trim();
  const isSoloArtist = toBoolean(raw?.is_solo_artist);
  const isPublished = raw?.is_published === undefined ? true : toBoolean(raw?.is_published);
  const sortOrder = toInteger(raw?.sort_order, 0, 0, 9999);
  const members = normalizeMembers(raw?.members);

  if (!name) {
    return { ok: false, error: 'Band name is required.' };
  }

  if (!summary) {
    return { ok: false, error: 'Summary is required.' };
  }

  if (!isValidMediaUrl(imageUrl) || !isValidMediaUrl(bannerImageUrl) || !isValidMediaUrl(bandPhotoUrl)) {
    return { ok: false, error: 'Image URLs must start with https:// or /' };
  }

  const generatedSlug = slugify(slugInput || name);
  if (!generatedSlug) {
    return { ok: false, error: 'A valid slug is required.' };
  }

  return {
    ok: true,
    slug: generatedSlug,
    payload: {
      name,
      era,
      years_active: yearsActive || null,
      genre: genre || null,
      genres_json: genres,
      tagline: tagline || null,
      summary,
      story: story || null,
      image_url: imageUrl || null,
      banner_image_url: bannerImageUrl || null,
      band_photo_url: bandPhotoUrl || null,
      is_solo_artist: isSoloArtist,
      is_published: isPublished,
      sort_order: sortOrder,
      members_json: serializeBandProfilePayload({
        members,
        social_links: normalizeSocialLinksMap(socialLinks || {}),
      }),
    },
  };
}

async function ensureUniqueBandSlug(supabase, baseSlug) {
  let counter = 1;
  let candidate = baseSlug;

  while (counter < 200) {
    const existing = await supabase.from('bands').select('id').eq('slug', candidate).limit(1).maybeSingle();
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

export async function GET(request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const era = request.nextUrl.searchParams.get('era');
  const safeEra = era === 'archive' || era === 'scene' ? era : null;

  const query = supabase
    .from('bands')
    .select('*')
    .order('era', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  const response = safeEra ? await query.eq('era', safeEra) : await query;

  if (response.error) {
    return NextResponse.json({ error: response.error.message }, { status: 500 });
  }

  return NextResponse.json({ items: response.data || [] });
}

export async function POST(request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = buildBandPayload(body, body.socials || {});
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const slugResult = await ensureUniqueBandSlug(supabase, parsed.slug);
  if (!slugResult.ok) {
    return NextResponse.json({ error: slugResult.error }, { status: 500 });
  }

  const insert = await supabase
    .from('bands')
    .insert({
      ...parsed.payload,
      slug: slugResult.slug,
    })
    .select('id, slug')
    .limit(1)
    .maybeSingle();

  if (insert.error) {
    const message = String(insert.error.message || '');
    if (message.includes('genres_json')) {
      const fallbackInsert = await supabase
        .from('bands')
        .insert({
          ...parsed.payload,
          genres_json: undefined,
          slug: slugResult.slug,
        })
        .select('id, slug')
        .limit(1)
        .maybeSingle();

      if (!fallbackInsert.error) {
        return NextResponse.json({ ok: true, item: fallbackInsert.data });
      }
      return NextResponse.json({ error: fallbackInsert.error.message }, { status: 500 });
    }

    return NextResponse.json({ error: insert.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, item: insert.data });
}
