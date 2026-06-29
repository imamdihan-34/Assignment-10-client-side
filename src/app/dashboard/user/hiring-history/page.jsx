'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { api } from '@/app/lib/api';
import { useAuth } from '@/app/hooks/useAuth';
 
export default function HiringHistory() {
  const { token, user } = useAuth();
  const [hirings, setHirings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
 
  useEffect(() => {
    if (!token) return;
 
    const fetchHirings = async () => {
      try {
        const response = await api.get('/hiring/user-history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHirings(response.data);
      } catch (error) {
        console.error('Failed to fetch hiring history:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchHirings();
  }, [token]);
 
  const handlePayment = async (hiringId, amount) => {
    router.push(`/payment/${hiringId}?amount=${amount}`);
  };
 
  if (loading) return <LoadingSpinner />;
 
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Hiring History</h1>
 
        {hirings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No hiring records yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Lawyer Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Specialization</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Fee</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {hirings.map((hiring) => (
                  <tr key={hiring._id} className="border-t border-gray-200">
                    <td className="px-6 py-4 text-gray-800">{hiring.lawyerId?.fullName}</td>
                    <td className="px-6 py-4 text-gray-600">{hiring.lawyerId?.specialization}</td>
                    <td className="px-6 py-4 text-gray-800 font-semibold">${hiring.lawyerId?.hourlyRate}</td>
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
                      {hiring.status === 'accepted' && !hiring.isPaid && (
                        <button
                          onClick={() => handlePayment(hiring._id, hiring.lawyerId?.hourlyRate)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          Pay Now
                        </button>
                      )}
                      {hiring.isPaid && (
                        <span className="text-green-600 font-semibold">Paid</span>
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
 