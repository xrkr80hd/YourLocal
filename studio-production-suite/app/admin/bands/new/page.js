import { getBandsForAdmin } from '../../../../lib/content';
import AdminBandCrudForm from '../../../../components/AdminBandCrudForm';

export const metadata = {
  title: 'New Band | Admin',
};

export default async function AdminNewBandPage({ searchParams }) {
  const allBands = await getBandsForAdmin();
  const genreOptions = Array.from(new Set(allBands.map((band) => String(band.genre || '').trim()).filter(Boolean)));
  const initialEra = searchParams?.era === 'scene' ? 'scene' : 'archive';

  return (
    <>
      <section className="card hero">
        <h1>Create Band</h1>
        <p>Create the band and members in one admin flow.</p>
      </section>
      <AdminBandCrudForm mode="create" genreOptions={genreOptions} initialEra={initialEra} />
    </>
  );
}
