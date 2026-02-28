import MusicShuffle from '../../components/MusicShuffle';
import { getTracks } from '../../lib/content';

export default async function MusicPage() {
  const tracks = await getTracks();

  return (
    <>
      <section className="card hero">
        <h1>Music</h1>
        <p>Original tracks built across guitar, bass, drums, and keys. Hit shuffle for retro-style discovery mode.</p>
      </section>
      <MusicShuffle tracks={tracks} />
    </>
  );
}
