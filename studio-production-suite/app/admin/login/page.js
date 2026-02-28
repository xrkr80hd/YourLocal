import Link from 'next/link';

export const metadata = {
  title: 'Admin Login | xrkr80hd Studio',
};

export default function AdminLoginPage() {
  return (
    <section className="card admin-login-card">
      <h1 className="section-title">Admin Access</h1>
      <p className="meta">Legacy Laravel login is no longer active on this Next.js runtime.</p>
      <p>Use the new admin entry point below:</p>
      <div className="actions">
        <Link className="button primary" href="/admin">
          Open Admin Dashboard
        </Link>
      </div>
    </section>
  );
}
