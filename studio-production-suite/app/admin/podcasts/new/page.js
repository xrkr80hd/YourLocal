import AdminPodcastCrudForm from '../../../../components/AdminPodcastCrudForm';
import { getPodcastEpisodesForAdmin } from '../../../../lib/content';

export const metadata = {
  title: 'New Podcast Episode | Admin',
};

export default async function AdminNewPodcastPage() {
  const episodes = await getPodcastEpisodesForAdmin();
  const topicOptions = Array.from(new Set(episodes.map((episode) => String(episode.topic || '').trim()).filter(Boolean)));

  return (
    <>
      <section className="card hero">
        <h1>Create Podcast Episode</h1>
        <p>Add episodes directly from backend admin.</p>
      </section>
      <AdminPodcastCrudForm mode="create" topicOptions={topicOptions} />
    </>
  );
}
