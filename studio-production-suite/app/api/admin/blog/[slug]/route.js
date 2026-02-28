import { NextResponse } from 'next/server';
import { slugify, clampText, toBoolean, isValidMediaUrl } from '../../../../../lib/admin-crud-utils';
import { getSupabaseAdmin } from '../../../../../lib/supabase-admin';

export const runtime = 'nodejs';

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

function buildPostPayload(raw) {
  const title = clampText(raw?.title, 255);
  const slugInput = clampText(raw?.slug, 255);
  const excerpt = clampText(raw?.excerpt, 300);
  const content = String(raw?.content || '').trim();
  const coverImageUrl = String(raw?.cover_image_url || '').trim();
  const publishedAt = formatDateTimeForDb(raw?.published_at);
  const isPublished = toBoolean(raw?.is_published);

  if (!title) {
    return { ok: false, error: 'Post title is required.' };
  }
  if (!content) {
    return { ok: false, error: 'Post content is required.' };
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
      excerpt: excerpt || null,
      content,
      cover_image_url: coverImageUrl || null,
      published_at: isPublished ? publishedAt || new Date().toISOString() : null,
      is_published: isPublished,
    },
  };
}

async function findPostBySlug(supabase, slug) {
  return supabase.from('blog_posts').select('*').eq('slug', slug).limit(1).maybeSingle();
}

async function ensureUniqueSlugForUpdate(supabase, baseSlug, id) {
  let counter = 1;
  let candidate = baseSlug;

  while (counter < 200) {
    const existing = await supabase.from('blog_posts').select('id').eq('slug', candidate).limit(1).maybeSingle();
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
    return NextResponse.json({ error: 'Post slug is required.' }, { status: 400 });
  }

  const response = await findPostBySlug(supabase, slug);
  if (response.error) {
    return NextResponse.json({ error: response.error.message }, { status: 500 });
  }
  if (!response.data) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
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
    return NextResponse.json({ error: 'Post slug is required.' }, { status: 400 });
  }

  const existing = await findPostBySlug(supabase, slug);
  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }
  if (!existing.data) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = buildPostPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const slugResult = await ensureUniqueSlugForUpdate(supabase, parsed.slug, existing.data.id);
  if (!slugResult.ok) {
    return NextResponse.json({ error: slugResult.error }, { status: 500 });
  }

  const update = await supabase
    .from('blog_posts')
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
    return NextResponse.json({ error: 'Post slug is required.' }, { status: 400 });
  }

  const existing = await findPostBySlug(supabase, slug);
  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }
  if (!existing.data) {
    return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  }

  const deleted = await supabase.from('blog_posts').delete().eq('id', existing.data.id);
  if (deleted.error) {
    return NextResponse.json({ error: deleted.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
