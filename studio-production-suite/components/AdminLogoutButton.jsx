'use client';

import { useRouter } from 'next/navigation';

export default function AdminLogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="button"
      onClick={async () => {
        await fetch('/api/admin/session', { method: 'DELETE' });
        router.push('/admin/login');
        router.refresh();
      }}
    >
      Sign Out
    </button>
  );
}
