import AdminPodcastCrudForm from '../../../../components/AdminPodcastCrudForm';
import { getPodcastsForAdmin } from '../../../../lib/content';

export const metadata = {
  title: 'New Podcast | Admin',
};

export default async function AdminNewPodcastPage() {
  const podcasts = await getPodcastsForAdmin();
  const topicOptions = Array.from(new Set(podcasts.map((podcast) => String(podcast.topic || '').trim()).filter(Boolean)));

  return (
    <>
      <section className="card hero">
        <h1>Create Local Podcast</h1>
        <p>Add podcast profile details first, then add episodes on the edit screen.</p>
      </section>
      <AdminPodcastCrudForm mode="create" topicOptions={topicOptions} />
    </>
  );
}
