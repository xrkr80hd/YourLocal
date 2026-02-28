import AdminMediaGuide from '../../../components/AdminMediaGuide';

export const metadata = {
  title: 'Admin Media Guide | xrkr80hd Studio',
};

export default function AdminGuidePage() {
  return (
    <>
      <section className="card hero">
        <h1>Admin Guide</h1>
        <p>Single source of truth for image sizes and media prep before upload.</p>
      </section>
      <AdminMediaGuide />
    </>
  );
}

