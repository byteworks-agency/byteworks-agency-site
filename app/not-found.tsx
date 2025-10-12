export default function NotFound() {
  return (
    <main className="container py-20 text-center">
      <h1 className="text-3xl md:text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you’re looking for doesn’t exist.</p>
      <a href="/" className="btn btn-primary mt-6">Back to home</a>
    </main>
  );
}