import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminBandSocialsForm from '../../../../../components/AdminBandSocialsForm';
import { getBandBySlugForAdmin } from '../../../../../lib/content';

export const metadata = {
  title: 'Band Social Links | Admin',
};

export default async function AdminBandSocialsPage({ params }) {
  const band = await getBandBySlugForAdmin(params.slug);

  if (!band) {
    notFound();
  }

  return (
    <>
      <section className="card hero">
        <h1>{band.name}</h1>
        <p>Configure which social links are enabled and what suffix to use for each platform.</p>
        <div className="actions">
          <Link className="button" href="/admin/bands">
            Back to Band List
          </Link>
          <Link className="button" href={`/bands/${band.slug}`}>
            Open Band Page
          </Link>
        </div>
      </section>

      <AdminBandSocialsForm band={band} />
    </>
  );
}
