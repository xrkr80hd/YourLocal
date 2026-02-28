import { notFound } from 'next/navigation';
import AdminBandCrudForm from '../../../../../components/AdminBandCrudForm';
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
  const genreOptions = Array.from(new Set(allBands.map((item) => String(item.genre || '').trim()).filter(Boolean)));

  return (
    <>
      <section className="card hero">
        <h1>Edit Band</h1>
        <p>Update details, members, and media from backend admin only.</p>
      </section>
      <AdminBandCrudForm mode="edit" initialBand={band} genreOptions={genreOptions} />
    </>
  );
}
