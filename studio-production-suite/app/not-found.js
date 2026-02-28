import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="card hero">
      <h1>404</h1>
      <p>The page you asked for was not found.</p>
      <div className="actions">
        <Link href="/" className="button primary">
          Go Home
        </Link>
      </div>
    </section>
  );
}
