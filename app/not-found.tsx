export default function GlobalNotFound() {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-lg text-gray-600 mb-8">Page not found</p>
          <a
            href="/en"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}
