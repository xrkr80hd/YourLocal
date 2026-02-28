import { notFound } from 'next/navigation';
import BandDetail from '../../../components/BandDetail';
import { getBandBySlug } from '../../../lib/content';

export default async function BandPage({ params }) {
  const band = await getBandBySlug(params.slug);

  if (!band) {
    notFound();
  }

  const isArchive = band.era === 'archive';

  return (
    <BandDetail
      band={band}
      backHref={isArchive ? '/local-legends-archive' : '/your-local-scene'}
      backLabel={isArchive ? 'Back to YourLocal Legends' : 'Back to YourLocal Scene'}
    />
  );
}
