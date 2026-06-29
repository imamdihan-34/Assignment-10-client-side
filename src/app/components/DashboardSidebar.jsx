'use client';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
 
export default function DashboardSidebar() {
  const { user } = useAuth();
 
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
 
      <div className="mb-8">
        <p className="text-gray-400 text-sm mb-1">Logged in as:</p>
        <p className="font-semibold text-lg capitalize">{user?.role}</p>
      </div>
 
      <nav className="space-y-4">
        <Link href="/dashboard" className="block px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          Dashboard Home
        </Link>
 
        {user?.role === 'user' && (
          <>
            <Link href="/dashboard/user/hiring-history" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition">
              📋 Hiring History
            </Link>
            <Link href="/dashboard/user/update-profile" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition">
              👤 Update Profile
            </Link>
            <Link href="/dashboard/user/comments" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition">
              💬 Comments
            </Link>
          </>
        )}
 
        {user?.role === 'lawyer' && (
          <>
            <Link href="/dashboard/lawyer/hiring-history" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition">
              📨 Hiring Requests
            </Link>
            <Link href="/dashboard/lawyer/manage-legal-profile" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition">
              ⚖️ Manage Services
            </Link>
          </>
        )}
 
        {user?.role === 'admin' && (
          <>
            <Link href="/dashboard/admin/manage-users" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition">
              👥 Manage Users
            </Link>
            <Link href="/dashboard/admin/all-transactions" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition">
              💳 Transactions
            </Link>
            <Link href="/dashboard/admin/analytics" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition">
              📊 Analytics
            </Link>
          </>
        )}
      </nav>
 
      <div className="mt-12 pt-6 border-t border-gray-700">
        <Link href="/" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition text-center">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
 