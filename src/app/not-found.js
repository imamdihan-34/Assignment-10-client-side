
'use client';
import Link from 'next/link';
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-2xl text-gray-800 mb-2">Page Not Found</p>
        <p className="text-gray-600 mb-8">The page you are looking for does not exist or has been moved.</p>
        <Link href="/">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
 