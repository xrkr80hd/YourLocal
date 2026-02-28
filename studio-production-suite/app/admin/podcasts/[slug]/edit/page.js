import { notFound } from 'next/navigation';
import AdminPodcastCrudForm from '../../../../../components/AdminPodcastCrudForm';
import { getPodcastEpisodeBySlugForAdmin, getPodcastEpisodesForAdmin } from '../../../../../lib/content';

export const metadata = {
  title: 'Edit Podcast Episode | Admin',
};

export default async function AdminEditPodcastPage({ params }) {
  const episode = await getPodcastEpisodeBySlugForAdmin(params.slug);
  if (!episode) {
    notFound();
  }

  const episodes = await getPodcastEpisodesForAdmin();
  const topicOptions = Array.from(new Set(episodes.map((item) => String(item.topic || '').trim()).filter(Boolean)));

  return (
    <>
      <section className="card hero">
        <h1>Edit Podcast Episode</h1>
        <p>Update media, topic, and publish settings from backend admin.</p>
      </section>
      <AdminPodcastCrudForm mode="edit" initialEpisode={episode} topicOptions={topicOptions} />
    </>
  );
}
