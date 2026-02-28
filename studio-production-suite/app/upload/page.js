import UploadForm from '../../components/UploadForm';

export default function UploadPage() {
  return (
    <>
      <section className="card hero">
        <h1>Upload Test</h1>
        <p>Use this page to test Supabase Storage uploads from your local Docker setup.</p>
      </section>
      <UploadForm />
    </>
  );
}
