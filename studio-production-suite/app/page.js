import Link from 'next/link';
import HomeTracksPlayer from '../components/HomeTracksPlayer';
import { getHomeTracks, getSiteProfile } from '../lib/content';

function Headline({ value }) {
  const text = String(value || 'XRKR80HD');

  if (/xrkr80hd/i.test(text)) {
    const suffix = text.replace(/xrkr80hd/i, '').trim();

    return (
      <h1>
        <span className="split-cool">XRKR</span>
        <span className="split-80">80</span>
        <span className="split-cool">HD</span>
        {suffix ? ` ${suffix}` : ''}
      </h1>
    );
  }

  return <h1>{text}</h1>;
}

const guideCards = [
  {
    title: 'XRKR80HDLocal Hub',
    body: 'Your all-in-one control room. Stream tracks, check visuals, watch clips, and catch updates from one page.',
    href: '/hub',
    cta: 'Open Hub',
    image: '/assets/cards/hub-card.png',
  },
  {
    title: 'YourLocal Legends',
    body: 'An archive for influential local bands that are no longer actively writing, releasing, or performing.',
    href: '/local-legends-archive',
    cta: 'Open Legends',
    image: '/assets/cards/local-legends-card.png',
  },
  {
    title: 'YourLocal Scene',
    body: 'The current movement: active bands, fresh releases, and artists still on stages now.',
    href: '/your-local-scene',
    cta: 'Open Scene',
    image: '/assets/cards/local-scene-card.png',
  },
  {
    title: 'YourLocal Podcast',
    body: 'Conversations and stories from artists, producers, and creators in your local scene.',
    href: '/podcast',
    cta: 'Open Podcast',
    image: '/assets/cards/local-podcast-card.png',
  },
  {
    title: 'Contact',
    body: 'Want your band, solo project, or podcast featured? Send your links and profile details here.',
    href: '/contact',
    cta: 'Contact Page',
    image: '/assets/cards/contact-card.png',
  },
];

export default async function HomePage() {
  const [profile, homeTracks] = await Promise.all([getSiteProfile(), getHomeTracks(12)]);

  return (
    <>
      <section className="hero home-hero home-unboxed">
        <div className="home-hero-profile">
          <div className="home-hero-avatar">
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="XRKR80HD avatar" /> : <span>XR</span>}
          </div>
          <div>
            <Headline value={profile?.headline} />
            {profile?.short_bio ? <p>{profile.short_bio}</p> : null}
            {profile?.full_bio ? <p>{profile.full_bio}</p> : null}
          </div>
        </div>
        <div className="actions">
          <Link className="button primary" href="/hub">
            Open XRKR80HDLocal Hub
          </Link>
          <Link className="button" href="/contact">
            Band Feature Contact
          </Link>
        </div>
      </section>

      <section className="section-space home-radio home-unboxed">
        <div className="home-player-head">
          <h3 className="section-title">Local Radio</h3>
          <span className="meta">Bands, artists, and XRKR80HD tracks</span>
        </div>
        <HomeTracksPlayer tracks={homeTracks} />
      </section>

      <section className="section-space home-guide home-unboxed">
        <h3 className="section-title">Site Guide</h3>
        <p className="meta">Quick jump into each page from the navbar.</p>
        <div className="home-page-flow">
          {guideCards.map((card) => (
            <article key={card.href} className="home-feature">
              <div className="home-feature-media" style={{ backgroundImage: `url('${card.image}')` }} />
              <div className="home-feature-copy">
                <h4>{card.title}</h4>
                <p>{card.body}</p>
                <Link className="button" href={card.href}>
                  {card.cta}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
