import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminTracksManager from '../../../components/AdminTracksManager';
import { ADMIN_SESSION_USER_COOKIE, isOwnerUsername } from '../../../lib/admin-auth';
import { getTracksForAdmin } from '../../../lib/content';

export const metadata = {
  title: 'Tracks Manager | xrkr80hd Studio',
};

export default async function AdminTracksPage() {
  const actingUser = cookies().get(ADMIN_SESSION_USER_COOKIE)?.value || '';
  if (!isOwnerUsername(actingUser)) {
    redirect('/admin');
  }

  const tracks = await getTracksForAdmin();

  return (
    <>
      <section className="card hero">
        <h1>Tracks Manager</h1>
        <p>Owner-only track CRUD: upload, order, and choose what appears in your home page player.</p>
      </section>
      <AdminTracksManager initialTracks={tracks} />
    </>
  );
}
