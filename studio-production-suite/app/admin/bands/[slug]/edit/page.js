import { notFound } from 'next/navigation';
import AdminBandCrudForm from '../../../../../components/AdminBandCrudForm';
import AdminBandTracksManager from '../../../../../components/AdminBandTracksManager';
import { getBandBySlugForAdmin, getBandsForAdmin } from '../../../../../lib/content';

export const metadata = {
  title: 'Edit Band | Admin',
};

export default async function AdminEditBandPage({ params }) {
  const band = await getBandBySlugForAdmin(params.slug);
  if (!band) {
    notFound();
  }

  const allBands = await getBandsForAdmin();
  const genreOptions = Array.from(
    new Set(
      allBands
        .flatMap((item) => {
          const list = Array.isArray(item.genres_json) ? item.genres_json : [];
          const base = String(item.genre || '').trim();
          return [...list, ...(base ? [base] : [])];
        })
        .map((item) => String(item || '').trim())
        .filter(Boolean)
    )
  );

  return (
    <>
      <section className="card hero">
        <h1>Edit Band</h1>
        <p>Update details, members, and media from backend admin only.</p>
      </section>
      <AdminBandCrudForm mode="edit" initialBand={band} genreOptions={genreOptions} />
      <AdminBandTracksManager bandSlug={band.slug} bandName={band.name} initialTracks={band.tracks || []} />
    </>
  );
}
