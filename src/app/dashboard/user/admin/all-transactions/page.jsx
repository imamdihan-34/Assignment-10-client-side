'use client';
import { useState, useEffect } from 'react';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { api } from '@/app/lib/api';
import { useAuth } from '@/app/hooks/useAuth';
 
export default function AllTransactions() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (!token) return;
 
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/admin/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchTransactions();
  }, [token]);
 
  if (loading) return <LoadingSpinner />;
 
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">All Transactions</h1>
 
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Transaction ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">User/Lawyer Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Amount ($)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-t border-gray-200">
                  <td className="px-6 py-4 text-gray-800 font-mono text-sm">{transaction._id}</td>
                  <td className="px-6 py-4 text-gray-600">{transaction.userId?.email || transaction.lawyerId?.email}</td>
                  <td className="px-6 py-4 text-gray-800 font-semibold">${transaction.amount}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}