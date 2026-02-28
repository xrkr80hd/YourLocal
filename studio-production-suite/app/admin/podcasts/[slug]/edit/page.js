import { notFound } from 'next/navigation';
import AdminPodcastEpisodesManager from '../../../../../components/AdminPodcastEpisodesManager';
import AdminPodcastCrudForm from '../../../../../components/AdminPodcastCrudForm';
import { getPodcastBySlugForAdmin, getPodcastEpisodesForPodcastAdmin, getPodcastsForAdmin } from '../../../../../lib/content';

export const metadata = {
  title: 'Edit Podcast | Admin',
};

export default async function AdminEditPodcastPage({ params }) {
  const podcast = await getPodcastBySlugForAdmin(params.slug);
  if (!podcast) {
    notFound();
  }

  const podcasts = await getPodcastsForAdmin();
  const topicOptions = Array.from(new Set(podcasts.map((item) => String(item.topic || '').trim()).filter(Boolean)));
  const episodes = await getPodcastEpisodesForPodcastAdmin(podcast.id);

  return (
    <>
      <section className="card hero">
        <h1>Edit Local Podcast</h1>
        <p>Update podcast details, then CRUD episodes for this podcast profile.</p>
      </section>
      <AdminPodcastCrudForm mode="edit" initialPodcast={podcast} topicOptions={topicOptions} />
      <AdminPodcastEpisodesManager podcastSlug={podcast.slug} initialEpisodes={episodes} />
    </>
  );
}
