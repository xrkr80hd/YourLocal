import AdminPasswordForm from '../../../components/AdminPasswordForm';

export const metadata = {
  title: 'My Password | Admin',
};

export default function AdminPasswordPage() {
  return (
    <>
      <section className="card hero">
        <h1>My Password</h1>
        <p>Each admin can update their own password here.</p>
      </section>
      <AdminPasswordForm />
    </>
  );
}
