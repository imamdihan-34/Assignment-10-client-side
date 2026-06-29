'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DashboardSidebar from '@/components/DashboardSidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
 
export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
 
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
 
  if (loading) return <LoadingSpinner />;
  if (!user) return null;
 
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user.fullName}!</h1>
          <p className="text-gray-600 mb-8">Role: <span className="font-semibold capitalize">{user.role}</span></p>
 
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Name:</span> {user.fullName}</p>
              <p><span className="font-semibold">Email:</span> {user.email}</p>
              <p><span className="font-semibold">Role:</span> {user.role === 'user' ? 'Client' : user.role === 'lawyer' ? 'Lawyer' : 'Administrator'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}