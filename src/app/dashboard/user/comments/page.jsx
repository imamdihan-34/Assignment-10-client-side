'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { api } from '@/app/lib/api';
import { useAuth } from '@/app/hooks/useAuth';
 
export default function CommentsManagement() {
  const { token } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
 
  useEffect(() => {
    if (!token) return;
 
    const fetchComments = async () => {
      try {
        const response = await api.get('/comment/my-comments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchComments();
  }, [token]);
 
  const handleDelete = async (commentId) => {
    if (!confirm('Are you sure?')) return;
 
    try {
      await api.delete(`/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      alert('Failed to delete comment');
    }
  };
 
  const handleEdit = async (commentId) => {
    try {
      await api.put(
        `/comment/${commentId}`,
        { comment: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(comments.map(c => c._id === commentId ? { ...c, comment: editText } : c));
      setEditingId(null);
    } catch (error) {
      alert('Failed to edit comment');
    }
  };
 
  if (loading) return <LoadingSpinner />;
 
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Comments</h1>
 
        {comments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No comments yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {comment.lawyerId?.fullName} - {comment.lawyerId?.specialization}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
 
                {editingId === comment._id ? (
                  <div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                      rows="4"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(comment._id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">{comment.comment}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(comment._id);
                          setEditText(comment.comment);
                        }}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}