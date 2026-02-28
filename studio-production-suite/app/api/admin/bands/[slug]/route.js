import { NextResponse } from 'next/server';
import { parseBandProfilePayload, serializeBandProfilePayload } from '../../../../../lib/band-profile';
import { slugify, clampText, toBoolean, toInteger, isValidMediaUrl } from '../../../../../lib/admin-crud-utils';
import { normalizeSocialLinksMap } from '../../../../../lib/social-platforms';
import { getSupabaseAdmin } from '../../../../../lib/supabase-admin';

export const runtime = 'nodejs';

function normalizeMembers(value) {
  const source = Array.isArray(value) ? value : [];
  return source
    .map((member) => ({
      name: clampText(member?.name, 120),
      role: clampText(member?.role, 120),
      image_url: String(member?.image_url || '').trim(),
    }))
    .filter((member) => member.name !== '' && isValidMediaUrl(member.image_url));
}

function buildBandPayload(raw, socialLinks) {
  const name = clampText(raw?.name, 255);
  const slugInput = clampText(raw?.slug, 255);
  const era = raw?.era === 'scene' ? 'scene' : 'archive';
  const yearsActive = clampText(raw?.years_active, 60);
  const genre = clampText(raw?.genre, 80);
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

async function findBandBySlug(supabase, slug) {
  return supabase.from('bands').select('id, slug, members_json').eq('slug', slug).limit(1).maybeSingle();
}

async function ensureUniqueBandSlugForUpdate(supabase, baseSlug, bandId) {
  let counter = 1;
  let candidate = baseSlug;

  while (counter < 200) {
    const existing = await supabase.from('bands').select('id').eq('slug', candidate).limit(1).maybeSingle();
    if (existing.error) {
      return { ok: false, error: existing.error.message };
    }
    if (!existing.data || Number(existing.data.id) === Number(bandId)) {
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
    return NextResponse.json({ error: 'Band slug is required.' }, { status: 400 });
  }

  const response = await supabase.from('bands').select('*').eq('slug', slug).limit(1).maybeSingle();
  if (response.error) {
    return NextResponse.json({ error: response.error.message }, { status: 500 });
  }
  if (!response.data) {
    return NextResponse.json({ error: 'Band not found.' }, { status: 404 });
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
    return NextResponse.json({ error: 'Band slug is required.' }, { status: 400 });
  }

  const existingResult = await findBandBySlug(supabase, slug);
  if (existingResult.error) {
    return NextResponse.json({ error: existingResult.error.message }, { status: 500 });
  }
  if (!existingResult.data) {
    return NextResponse.json({ error: 'Band not found.' }, { status: 404 });
  }

  const existingProfile = parseBandProfilePayload(existingResult.data.members_json);
  const body = await request.json().catch(() => ({}));
  const socialLinks = body.socials === undefined ? existingProfile.social_links : body.socials;
  const parsed = buildBandPayload(body, socialLinks);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const slugResult = await ensureUniqueBandSlugForUpdate(supabase, parsed.slug, existingResult.data.id);
  if (!slugResult.ok) {
    return NextResponse.json({ error: slugResult.error }, { status: 500 });
  }

  const update = await supabase
    .from('bands')
    .update({
      ...parsed.payload,
      slug: slugResult.slug,
    })
    .eq('id', existingResult.data.id)
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
    return NextResponse.json({ error: 'Band slug is required.' }, { status: 400 });
  }

  const existingResult = await findBandBySlug(supabase, slug);
  if (existingResult.error) {
    return NextResponse.json({ error: existingResult.error.message }, { status: 500 });
  }
  if (!existingResult.data) {
    return NextResponse.json({ error: 'Band not found.' }, { status: 404 });
  }

  const deleted = await supabase.from('bands').delete().eq('id', existingResult.data.id);
  if (deleted.error) {
    return NextResponse.json({ error: deleted.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
