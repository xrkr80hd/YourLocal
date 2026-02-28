import { NextResponse } from 'next/server';
import { ADMIN_SESSION_USER_COOKIE, isOwnerUsername } from '../../../../lib/admin-auth';
import { clampText, isValidMediaUrl } from '../../../../lib/admin-crud-utils';
import { getSupabaseAdmin } from '../../../../lib/supabase-admin';

export const runtime = 'nodejs';

function ownerGuard(request) {
  const actingUser = request.cookies.get(ADMIN_SESSION_USER_COOKIE)?.value || '';
  return isOwnerUsername(actingUser);
}

function missingColumnsHelp() {
  return 'Run the SQL patch in SUPABASE_ADMIN_SCHEMA_PATCH.md to add homepage image columns.';
}

function buildPayload(raw) {
  const headline = clampText(raw?.headline, 255);
  const shortBio = clampText(raw?.short_bio, 300);
  const fullBio = String(raw?.full_bio || '').trim();
  const avatarUrl = String(raw?.avatar_url || '').trim();
  const legendsCardImageUrl = String(raw?.home_legends_card_image_url || '').trim();
  const sceneCardImageUrl = String(raw?.home_scene_card_image_url || '').trim();
  const podcastCardImageUrl = String(raw?.home_podcast_card_image_url || '').trim();
  const hubCardImageUrl = String(raw?.home_hub_card_image_url || '').trim();
  const businessCardImageUrl = String(raw?.home_business_card_image_url || '').trim();
  const contactCardImageUrl = String(raw?.home_contact_card_image_url || '').trim();

  if (
    !isValidMediaUrl(avatarUrl) ||
    !isValidMediaUrl(legendsCardImageUrl) ||
    !isValidMediaUrl(sceneCardImageUrl) ||
    !isValidMediaUrl(podcastCardImageUrl) ||
    !isValidMediaUrl(hubCardImageUrl) ||
    !isValidMediaUrl(businessCardImageUrl) ||
    !isValidMediaUrl(contactCardImageUrl)
  ) {
    return { ok: false, error: 'Image URLs must start with https:// or /' };
  }

  return {
    ok: true,
    payload: {
      headline: headline || null,
      short_bio: shortBio || null,
      full_bio: fullBio || null,
      avatar_url: avatarUrl || null,
      home_legends_card_image_url: legendsCardImageUrl || null,
      home_scene_card_image_url: sceneCardImageUrl || null,
      home_podcast_card_image_url: podcastCardImageUrl || null,
      home_hub_card_image_url: hubCardImageUrl || null,
      home_business_card_image_url: businessCardImageUrl || null,
      home_contact_card_image_url: contactCardImageUrl || null,
    },
  };
}

async function getFirstProfileRow(supabase) {
  return supabase.from('site_profiles').select('*').order('id', { ascending: true }).limit(1);
}

export async function GET(request) {
  if (!ownerGuard(request)) {
    return NextResponse.json({ error: 'Only the owner account can manage site profile settings.' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const result = await getFirstProfileRow(supabase);
  if (result.error) {
    const message = String(result.error.message || '');
    if (
      message.includes('home_legends_card_image_url') ||
      message.includes('home_scene_card_image_url') ||
      message.includes('home_podcast_card_image_url') ||
      message.includes('home_hub_card_image_url') ||
      message.includes('home_business_card_image_url') ||
      message.includes('home_contact_card_image_url')
    ) {
      return NextResponse.json({ error: `${message} ${missingColumnsHelp()}` }, { status: 500 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ item: (result.data && result.data[0]) || null });
}

export async function PUT(request) {
  if (!ownerGuard(request)) {
    return NextResponse.json({ error: 'Only the owner account can manage site profile settings.' }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = buildPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const existing = await getFirstProfileRow(supabase);
  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }

  const existingRow = (existing.data && existing.data[0]) || null;
  const mutation = existingRow
    ? supabase.from('site_profiles').update(parsed.payload).eq('id', existingRow.id).select('*').limit(1).maybeSingle()
    : supabase.from('site_profiles').insert(parsed.payload).select('*').limit(1).maybeSingle();

  const saved = await mutation;
  if (saved.error) {
    const message = String(saved.error.message || '');
    if (
      message.includes('home_legends_card_image_url') ||
      message.includes('home_scene_card_image_url') ||
      message.includes('home_podcast_card_image_url') ||
      message.includes('home_hub_card_image_url') ||
      message.includes('home_business_card_image_url') ||
      message.includes('home_contact_card_image_url')
    ) {
      return NextResponse.json({ error: `${message} ${missingColumnsHelp()}` }, { status: 500 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, item: saved.data || null });
}
