'use client';
import { useState, useEffect } from 'react';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { api } from '@/app/lib/api';
import { useAuth } from '@/app/hooks/useAuth';
 
export default function ManageUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (!token) return;
 
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchUsers();
  }, [token]);
 
  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(
        `/admin/user/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert('Failed to change role');
    }
  };
 
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure?')) return;
 
    try {
      await api.delete(`/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      alert('Failed to delete user');
    }
  };
 
  if (loading) return <LoadingSpinner />;
 
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Users</h1>
 
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Change Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-200">
                  <td className="px-6 py-4 text-gray-800">{user.fullName}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg"
                    >
                      <option value="user">Client</option>
                      <option value="lawyer">Lawyer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}