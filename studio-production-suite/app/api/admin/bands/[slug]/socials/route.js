import { NextResponse } from 'next/server';
import { parseBandProfilePayload, serializeBandProfilePayload } from '../../../../../../lib/band-profile';
import { normalizeSocialLinksMap } from '../../../../../../lib/social-platforms';
import { getSupabaseAdmin } from '../../../../../../lib/supabase-admin';

export const runtime = 'nodejs';

export async function PUT(request, { params }) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ error: 'Missing Supabase server credentials.' }, { status: 500 });
  }

  const slug = String(params.slug || '').trim();

  if (!slug) {
    return NextResponse.json({ error: 'Band slug is required.' }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const socials = normalizeSocialLinksMap(body.socials);

  const bandResult = await supabase
    .from('bands')
    .select('id, slug, members_json')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();

  if (bandResult.error) {
    return NextResponse.json({ error: bandResult.error.message }, { status: 500 });
  }

  if (!bandResult.data) {
    return NextResponse.json({ error: 'Band not found.' }, { status: 404 });
  }

  const profile = parseBandProfilePayload(bandResult.data.members_json);
  const nextPayload = serializeBandProfilePayload({
    members: profile.members,
    social_links: socials,
  });

  const updateResult = await supabase
    .from('bands')
    .update({ members_json: nextPayload })
    .eq('id', bandResult.data.id)
    .select('id')
    .limit(1)
    .maybeSingle();

  if (updateResult.error) {
    return NextResponse.json({ error: updateResult.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
