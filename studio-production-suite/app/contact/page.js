import { getSiteProfile } from '../../lib/content';

export default async function ContactPage() {
  const profile = await getSiteProfile();
  const email = profile?.email || 'contact@xrkr80hd.studio';

  return (
    <>
      <section className="card hero">
        <h1>
          <span className="hero-accent">Contact</span> YourLocal Feature Desk
        </h1>
        <p>If your band, artist project, or podcast should be featured on YourLocal, send details and links.</p>
      </section>

      <section className="card section-space contact-card">
        <h3 className="section-title">Submit Your Project</h3>
        <p>Send your band/artist/podcast name, genre, city, short bio, and links to your best tracks or episodes.</p>
        <div className="actions">
          <a className="button primary" href={`mailto:${email}`}>
            Email {email}
          </a>
        </div>
        <p className="meta">
          Recommended assets: banner image 2560x1440, profile image 1080x1080, member photos 1080x1350.
        </p>
      </section>
    </>
  );
}
