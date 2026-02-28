import UploadForm from '../../components/UploadForm';

export default function UploadPage() {
  return (
    <>
      <section className="card hero">
        <h1>Upload Test</h1>
        <p>Use this page to test Supabase Storage uploads with your folder presets.</p>
      </section>
      <UploadForm />
    </>
  );
}
