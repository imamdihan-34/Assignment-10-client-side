'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          LegalEase
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-blue-200 transition">
            Home
          </Link>
          <Link href="/browse-lawyers" className="hover:text-blue-200 transition">
            Browse Lawyers
          </Link>

          {isClient && user ? (
            <>
              <Link href="/dashboard" className="hover:text-blue-200 transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : isClient ? (
            <>
              <Link
                href="/register"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="border border-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}