'use client';
import { useEffect } from 'react';
 
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-50 to-red-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">⚠️ Error</h1>
        <p className="text-xl text-gray-600 mb-8">Something went wrong</p>
        <div className="space-y-4">
          <p className="text-gray-500 mb-6">{error?.message || 'An unexpected error occurred'}</p>
          <button
            onClick={() => reset()}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}