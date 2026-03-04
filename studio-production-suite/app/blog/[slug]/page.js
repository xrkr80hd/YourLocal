import { notFound } from 'next/navigation';
import { getPostBySlug } from '../../../lib/content';
import { formatDate } from '../../../lib/format';

function formatContent(text) {
  return String(text || '')
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="card blog-post-card">
      <h1 className="section-title">{post.title}</h1>
      <p className="meta">{formatDate(post.published_at)}</p>
      {post.cover_image_url ? <img className="blog-cover-image" src={post.cover_image_url} alt={post.title} /> : null}
      {formatContent(post.content).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </article>
  );
}
