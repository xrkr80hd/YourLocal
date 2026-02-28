import { getSupabaseAdmin } from './supabase-admin';

const DEFAULT_GENRES = [
  'metal',
  'rock',
  'christian',
  'covers',
  'orchestral/soundtrack',
  'indie',
  'djent',
  'gospel',
  'country',
  'hip-hop',
  'other',
];

async function runQuery(label, callback, fallbackValue) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return fallbackValue;
  }

  try {
    const response = await callback(supabase);

    if (response.error) {
      const message = response.error.message || '';
      if (!message.includes("Could not find the table")) {
        console.error(`[content:${label}]`, message);
      }
      return fallbackValue;
    }

    return response.data ?? fallbackValue;
  } catch (error) {
    console.error(`[content:${label}]`, error);
    return fallbackValue;
  }
}

function toMembers(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

export async function getSiteProfile() {
  const rows = await runQuery(
    'site_profiles',
    (supabase) => supabase.from('site_profiles').select('*').order('id', { ascending: true }).limit(1),
    []
  );

  return rows[0] || null;
}

export async function getHomeTracks(limit = 12) {
  return runQuery(
    'tracks_home',
    (supabase) =>
      supabase
        .from('tracks')
        .select('*')
        .order('release_date', { ascending: false, nullsFirst: false })
        .order('id', { ascending: false })
        .limit(limit),
    []
  );
}

export async function getTracks(limit = null) {
  const base = (supabase) => {
    const query = supabase
      .from('tracks')
      .select('*')
      .order('release_date', { ascending: false, nullsFirst: false })
      .order('id', { ascending: false });

    return Number.isInteger(limit) ? query.limit(limit) : query;
  };

  return runQuery('tracks_all', base, []);
}

export async function getBandsByEra(era) {
  return runQuery(
    `bands_${era}`,
    (supabase) =>
      supabase
        .from('bands')
        .select('*')
        .eq('era', era)
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true }),
    []
  );
}

export async function getBandBySlug(slug) {
  const band = await runQuery(
    `band_${slug}`,
    (supabase) =>
      supabase
        .from('bands')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .limit(1)
        .maybeSingle(),
    null
  );

  if (!band) {
    return null;
  }

  return {
    ...band,
    members_json: toMembers(band.members_json),
  };
}

export async function getPodcastEpisodes() {
  return runQuery(
    'podcasts',
    (supabase) =>
      supabase
        .from('podcast_episodes')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false }),
    []
  );
}

export async function getProjects() {
  return runQuery(
    'projects',
    (supabase) => supabase.from('projects').select('*').order('created_at', { ascending: false }),
    []
  );
}

export async function getPublishedPosts() {
  return runQuery(
    'blog_posts',
    (supabase) =>
      supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false, nullsFirst: false }),
    []
  );
}

export async function getPostBySlug(slug) {
  return runQuery(
    `post_${slug}`,
    (supabase) =>
      supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .limit(1)
        .maybeSingle(),
    null
  );
}

export async function getMediaByType(type) {
  return runQuery(
    `media_${type}`,
    (supabase) =>
      supabase
        .from('media_items')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false }),
    []
  );
}

export async function getHubData() {
  const [tracks, projects, posts, photos, videos, media] = await Promise.all([
    getTracks(64),
    getProjects(),
    getPublishedPosts(),
    getMediaByType('photo'),
    getMediaByType('video'),
    runQuery(
      'media_all',
      (supabase) => supabase.from('media_items').select('*').order('created_at', { ascending: false }),
      []
    ),
  ]);

  return {
    tracks,
    projects,
    posts,
    photos,
    videos,
    media,
    counts: {
      tracks: tracks.length,
      projects: projects.length,
      posts: posts.length,
      media: media.length,
    },
  };
}

export function groupTracksByGenre(tracks) {
  const map = new Map();

  for (const track of tracks) {
    const key = String(track.genre || 'other').trim().toLowerCase() || 'other';

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push(track);
  }

  const sortedKeys = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));
  const allGenres = Array.from(new Set([...DEFAULT_GENRES, ...sortedKeys])).sort((a, b) => a.localeCompare(b));

  return {
    tracksByGenre: map,
    allGenres,
  };
}
