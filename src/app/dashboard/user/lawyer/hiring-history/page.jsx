'use client';
import { useState, useEffect } from 'react';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { api } from '@/app/lib/api';
import { useAuth } from '@/app/hooks/useAuth';
 
export default function LawyerHiringHistory() {
  const { token } = useAuth();
  const [hirings, setHirings] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (!token) return;
 
    const fetchHirings = async () => {
      try {
        const response = await api.get('/hiring/lawyer-requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHirings(response.data);
      } catch (error) {
        console.error('Failed to fetch hiring requests:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchHirings();
  }, [token]);
 
  const handleAccept = async (hiringId) => {
    try {
      await api.put(
        `/hiring/${hiringId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHirings(hirings.map(h => h._id === hiringId ? { ...h, status: 'accepted' } : h));
    } catch (error) {
      alert('Failed to accept request');
    }
  };
 
  const handleReject = async (hiringId) => {
    try {
      await api.put(
        `/hiring/${hiringId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHirings(hirings.map(h => h._id === hiringId ? { ...h, status: 'rejected' } : h));
    } catch (error) {
      alert('Failed to reject request');
    }
  };
 
  if (loading) return <LoadingSpinner />;
 
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Hiring Requests</h1>
 
        {hirings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No hiring requests yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Client Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Request Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {hirings.map((hiring) => (
                  <tr key={hiring._id} className="border-t border-gray-200">
                    <td className="px-6 py-4 text-gray-800">{hiring.userId?.fullName}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(hiring.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        hiring.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        hiring.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {hiring.status.charAt(0).toUpperCase() + hiring.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {hiring.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(hiring._id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(hiring._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
 