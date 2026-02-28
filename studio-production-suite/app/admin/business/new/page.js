import AdminBusinessCrudForm from '../../../../components/AdminBusinessCrudForm';
import { getLocalBusinessesForAdmin } from '../../../../lib/content';

export const metadata = {
  title: 'New Business | Admin',
};

export default async function AdminNewBusinessPage() {
  const businesses = await getLocalBusinessesForAdmin();
  const categoryOptions = Array.from(new Set(businesses.map((item) => String(item.category || '').trim()).filter(Boolean)));

  return (
    <>
      <section className="card hero">
        <h1>Create Business Card</h1>
        <p>Add a local business listing to the public YourLocal Business page.</p>
      </section>
      <AdminBusinessCrudForm mode="create" categoryOptions={categoryOptions} />
    </>
  );
}

