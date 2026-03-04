import Link from 'next/link';
import SharePostLinkButton from '../../components/SharePostLinkButton';
import { getPublishedPosts } from '../../lib/content';
import { formatDate } from '../../lib/format';

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <section className="card hero">
        <h1>Blog</h1>
        <p>Thoughts on music, creative process, faith, and building with purpose.</p>
      </section>

      <section className="stack-grid section-space">
        {posts.length ? (
          posts.map((post) => (
            <article key={post.id} className="card">
              <h3 className="section-title">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="meta">{formatDate(post.published_at)}</p>
              {post.excerpt ? <p>{post.excerpt}</p> : null}
              <div className="actions">
                <Link className="button" href={`/blog/${post.slug}`}>
                  Read Post
                </Link>
                <SharePostLinkButton path={`/blog/${post.slug}`} title={post.title} />
              </div>
            </article>
          ))
        ) : (
          <article className="card">
            <p className="meta">No published posts yet.</p>
          </article>
        )}
      </section>
    </>
  );
}
