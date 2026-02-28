import { notFound } from 'next/navigation';
import AdminBusinessCrudForm from '../../../../../components/AdminBusinessCrudForm';
import { getLocalBusinessByIdForAdmin, getLocalBusinessesForAdmin } from '../../../../../lib/content';

export const metadata = {
  title: 'Edit Business | Admin',
};

export default async function AdminEditBusinessPage({ params }) {
  const business = await getLocalBusinessByIdForAdmin(params.id);
  if (!business) {
    notFound();
  }

  const businesses = await getLocalBusinessesForAdmin();
  const categoryOptions = Array.from(new Set(businesses.map((item) => String(item.category || '').trim()).filter(Boolean)));

  return (
    <>
      <section className="card hero">
        <h1>Edit Business Card</h1>
        <p>Update details, logo, link, and publish status for this listing.</p>
      </section>
      <AdminBusinessCrudForm mode="edit" initialBusiness={business} categoryOptions={categoryOptions} />
    </>
  );
}

