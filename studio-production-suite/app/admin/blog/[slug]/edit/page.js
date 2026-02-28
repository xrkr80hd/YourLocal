import { notFound } from 'next/navigation';
import AdminBlogCrudForm from '../../../../../components/AdminBlogCrudForm';
import { getPostBySlugForAdmin } from '../../../../../lib/content';

export const metadata = {
  title: 'Edit Blog Post | Admin',
};

export default async function AdminEditBlogPostPage({ params }) {
  const post = await getPostBySlugForAdmin(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <>
      <section className="card hero">
        <h1>Edit Blog Post</h1>
        <p>Update content and publish settings from admin.</p>
      </section>
      <AdminBlogCrudForm mode="edit" initialPost={post} />
    </>
  );
}
