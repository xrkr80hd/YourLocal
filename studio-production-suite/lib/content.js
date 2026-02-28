import { getSupabaseAdmin } from './supabase-admin';
import { parseBandProfilePayload } from './band-profile';

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

export async function getSiteProfile() {
  const rows = await runQuery(
    'site_profiles',
    (supabase) => supabase.from('site_profiles').select('*').order('id', { ascending: true }).limit(1),
    []
  );

  return rows[0] || null;
}

async function fetchTracksOrdered({ featuredOnly = false, limit = null } = {}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const run = (includeSortOrder) => {
    let query = supabase.from('tracks').select('*');

    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }

    if (includeSortOrder) {
      query = query.order('sort_order', { ascending: true });
    }

    query = query.order('release_date', { ascending: false, nullsFirst: false }).order('id', { ascending: false });

    return Number.isInteger(limit) ? query.limit(limit) : query;
  };

  try {
    const ordered = await run(true);
    if (!ordered.error) {
      return ordered.data || [];
    }

    const message = String(ordered.error.message || '');
    if (!message.includes('sort_order')) {
      console.error('[content:tracks_ordered]', message);
      return [];
    }

    const fallback = await run(false);
    if (fallback.error) {
      console.error('[content:tracks_fallback]', fallback.error.message);
      return [];
    }

    return (fallback.data || []).map((item) => ({ ...item, sort_order: 0 }));
  } catch (error) {
    console.error('[content:tracks]', error);
    return [];
  }
}

export async function getHomeTracks(limit = 12) {
  const featured = await fetchTracksOrdered({ featuredOnly: true, limit });
  if (featured.length) {
    return featured;
  }

  return fetchTracksOrdered({ featuredOnly: false, limit });
}

export async function getTracks(limit = null) {
  return fetchTracksOrdered({ featuredOnly: false, limit });
}

export async function getTracksForAdmin() {
  return fetchTracksOrdered({ featuredOnly: false, limit: null });
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

  const profile = parseBandProfilePayload(band.members_json);

  return {
    ...band,
    members: profile.members,
    social_links: profile.social_links,
  };
}

export async function getCurrentBandsForAdmin() {
  return runQuery(
    'admin_bands_scene',
    (supabase) =>
      supabase
        .from('bands')
        .select('*')
        .eq('era', 'scene')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true }),
    []
  );
}

export async function getBandsForAdmin(era = null) {
  const safeEra = era === 'archive' || era === 'scene' ? era : null;
  return runQuery(
    `admin_bands_${safeEra || 'all'}`,
    (supabase) => {
      const query = supabase
        .from('bands')
        .select('*')
        .order('era', { ascending: true })
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      return safeEra ? query.eq('era', safeEra) : query;
    },
    []
  );
}

export async function getBandBySlugForAdmin(slug) {
  const band = await runQuery(
    `admin_band_${slug}`,
    (supabase) =>
      supabase
        .from('bands')
        .select('*')
        .eq('slug', slug)
        .limit(1)
        .maybeSingle(),
    null
  );

  if (!band) {
    return null;
  }

  const profile = parseBandProfilePayload(band.members_json);

  return {
    ...band,
    members: profile.members,
    social_links: profile.social_links,
  };
}

async function fetchPodcasts({ publishedOnly = false } = {}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const run = (includeSortOrder) => {
    let query = supabase.from('podcasts').select('*');
    if (publishedOnly) {
      query = query.eq('is_published', true);
    }
    if (includeSortOrder) {
      query = query.order('sort_order', { ascending: true });
    }
    return query.order('title', { ascending: true });
  };

  try {
    const ordered = await run(true);
    if (!ordered.error) {
      return ordered.data || [];
    }

    const message = String(ordered.error.message || '');
    if (!message.includes('sort_order')) {
      if (!message.includes('Could not find the table')) {
        console.error('[content:podcasts]', message);
      }
      return [];
    }

    const fallback = await run(false);
    if (fallback.error) {
      console.error('[content:podcasts_fallback]', fallback.error.message);
      return [];
    }

    return (fallback.data || []).map((item) => ({ ...item, sort_order: 0 }));
  } catch (error) {
    console.error('[content:podcasts_error]', error);
    return [];
  }
}

async function fetchPodcastEpisodesByPodcastId(podcastId, { publishedOnly = false, limit = null } = {}) {
  const safeId = Number.parseInt(String(podcastId || ''), 10);
  if (!Number.isFinite(safeId) || safeId <= 0) {
    return [];
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const run = (includeSortOrder) => {
    let query = supabase.from('podcast_episodes').select('*').eq('podcast_id', safeId);
    if (publishedOnly) {
      query = query.eq('is_published', true);
    }
    if (includeSortOrder) {
      query = query.order('sort_order', { ascending: true });
    }
    query = query.order('published_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false });
    return Number.isInteger(limit) ? query.limit(limit) : query;
  };

  try {
    const ordered = await run(true);
    if (!ordered.error) {
      return ordered.data || [];
    }

    const message = String(ordered.error.message || '');
    if (!message.includes('sort_order')) {
      if (!message.includes('Could not find the table')) {
        console.error('[content:podcast_episodes]', message);
      }
      return [];
    }

    const fallback = await run(false);
    if (fallback.error) {
      console.error('[content:podcast_episodes_fallback]', fallback.error.message);
      return [];
    }

    return (fallback.data || []).map((item) => ({ ...item, sort_order: 0 }));
  } catch (error) {
    console.error('[content:podcast_episodes_error]', error);
    return [];
  }
}

export async function getPublishedPodcasts() {
  return fetchPodcasts({ publishedOnly: true });
}

export async function getPodcastsForAdmin() {
  return fetchPodcasts({ publishedOnly: false });
}

export async function getPodcastBySlugForAdmin(slug) {
  return runQuery(
    `podcast_show_admin_${slug}`,
    (supabase) =>
      supabase
        .from('podcasts')
        .select('*')
        .eq('slug', slug)
        .limit(1)
        .maybeSingle(),
    null
  );
}

export async function getPublishedPodcastBySlug(slug) {
  return runQuery(
    `podcast_show_public_${slug}`,
    (supabase) =>
      supabase
        .from('podcasts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .limit(1)
        .maybeSingle(),
    null
  );
}

export async function getPodcastEpisodesForPodcast(podcastId, limit = null) {
  return fetchPodcastEpisodesByPodcastId(podcastId, { publishedOnly: true, limit });
}

export async function getPodcastEpisodesForPodcastAdmin(podcastId) {
  return fetchPodcastEpisodesByPodcastId(podcastId, { publishedOnly: false, limit: null });
}

async function fetchLocalBusinesses({ publishedOnly = false } = {}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const run = (includeSortOrder) => {
    let query = supabase.from('local_businesses').select('*');
    if (publishedOnly) {
      query = query.eq('is_published', true);
    }
    if (includeSortOrder) {
      query = query.order('sort_order', { ascending: true });
    }
    return query.order('name', { ascending: true });
  };

  try {
    const ordered = await run(true);
    if (!ordered.error) {
      return ordered.data || [];
    }

    const message = String(ordered.error.message || '');
    if (!message.includes('sort_order')) {
      if (!message.includes('Could not find the table')) {
        console.error('[content:local_businesses]', message);
      }
      return [];
    }

    const fallback = await run(false);
    if (fallback.error) {
      console.error('[content:local_businesses_fallback]', fallback.error.message);
      return [];
    }

    return (fallback.data || []).map((item) => ({ ...item, sort_order: 0 }));
  } catch (error) {
    console.error('[content:local_businesses_error]', error);
    return [];
  }
}

export async function getPublishedLocalBusinesses() {
  return fetchLocalBusinesses({ publishedOnly: true });
}

export async function getLocalBusinessesForAdmin() {
  return fetchLocalBusinesses({ publishedOnly: false });
}

export async function getLocalBusinessByIdForAdmin(id) {
  const safeId = Number.parseInt(String(id || ''), 10);
  if (!Number.isFinite(safeId) || safeId <= 0) {
    return null;
  }

  return runQuery(
    `local_business_admin_${safeId}`,
    (supabase) =>
      supabase
        .from('local_businesses')
        .select('*')
        .eq('id', safeId)
        .limit(1)
        .maybeSingle(),
    null
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

export async function getPostsForAdmin() {
  return runQuery(
    'blog_posts_admin',
    (supabase) =>
      supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false }),
    []
  );
}

export async function getPostBySlugForAdmin(slug) {
  return runQuery(
    `blog_post_admin_${slug}`,
    (supabase) =>
      supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
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
    getTracks(),
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
