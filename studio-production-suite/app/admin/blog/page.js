import Link from 'next/link';
import { formatDate } from '../../../lib/format';
import { getPostsForAdmin } from '../../../lib/content';

export const metadata = {
  title: 'Blog Manager | Admin',
};
export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const posts = await getPostsForAdmin();

  return (
    <>
      <section className="card hero">
        <h1>Blog Manager</h1>
        <p>Write, edit, and publish posts for xrkr80hd.studio from admin.</p>
        <div className="actions">
          <Link className="button primary" href="/admin/blog/new" prefetch={false}>
            New Blog Post
          </Link>
          <Link className="button" href="/blog" prefetch={false}>
            View Public Blog
          </Link>
        </div>
      </section>

      <section className="section-space">
        {posts.length ? (
          <div className="grid">
            {posts.map((post) => (
              <article key={post.id} className="card">
                <h3 className="section-title">{post.title}</h3>
                <p className="meta">
                  {post.is_published ? 'Published' : 'Draft'} {post.published_at ? `| ${formatDate(post.published_at)}` : ''}
                </p>
                {post.excerpt ? <p>{post.excerpt}</p> : null}
                <div className="actions">
                  <Link className="button primary" href={`/admin/blog/${post.slug}/edit`} prefetch={false}>
                    Edit Post
                  </Link>
                  <Link className="button" href={`/blog/${post.slug}`} prefetch={false}>
                    View Post
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <article className="card">
            <p className="meta">No blog posts yet.</p>
          </article>
        )}
      </section>
    </>
  );
}
