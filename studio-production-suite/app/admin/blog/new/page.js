import AdminBlogCrudForm from '../../../../components/AdminBlogCrudForm';

export const metadata = {
  title: 'New Blog Post | Admin',
};

export default function AdminNewBlogPostPage() {
  return (
    <>
      <section className="card hero">
        <h1>Create Blog Post</h1>
        <p>Write and publish a new post from your admin dashboard.</p>
      </section>
      <AdminBlogCrudForm mode="create" />
    </>
  );
}
