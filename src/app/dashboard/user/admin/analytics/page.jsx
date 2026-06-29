'use client';
import { useState, useEffect } from 'react';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { api } from '@/app/lib/api';
import { useAuth } from '@/app/hooks/useAuth';
 
export default function Analytics() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalHires: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (!token) return;
 
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchAnalytics();
  }, [token]);
 
  if (loading) return <LoadingSpinner />;
 
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Analytics Overview</h1>
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 font-semibold mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-blue-600">{analytics.totalUsers}</p>
          </div>
 
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 font-semibold mb-2">Total Lawyers</h3>
            <p className="text-4xl font-bold text-green-600">{analytics.totalLawyers}</p>
          </div>
 
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 font-semibold mb-2">Total Hires</h3>
            <p className="text-4xl font-bold text-purple-600">{analytics.totalHires}</p>
          </div>
 
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 font-semibold mb-2">Total Revenue</h3>
            <p className="text-4xl font-bold text-red-600">${analytics.totalRevenue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}