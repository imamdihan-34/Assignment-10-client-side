 
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { api } from '@/app/lib/api';
import { useAuth } from '@/app/hooks/useAuth';
 
export default function LawyerDetails() {
  const params = useParams();
  const { user, token } = useAuth();
  const [lawyer, setLawyer] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHireModal, setShowHireModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [canComment, setCanComment] = useState(false);
 
  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const response = await api.get(`/lawyer/${params.id}`);
        setLawyer(response.data);
 
        const commentsRes = await api.get(`/comment/lawyer/${params.id}`);
        setComments(commentsRes.data);
 
        if (token && user) {
          const hiringRes = await api.get(`/hiring/check/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCanComment(hiringRes.data.hired);
        }
      } catch (error) {
        console.error('Failed to fetch lawyer:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchLawyer();
  }, [params.id, token, user]);
 
  const handleHire = async () => {
    if (!token) {
      alert('Please login to hire');
      return;
    }
 
    try {
      await api.post(
        `/hiring/create`,
        { lawyerId: params.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Hiring request sent!');
      setShowHireModal(false);
      setCanComment(true);
    } catch (error) {
      alert('Failed to send hiring request');
    }
  };
 
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
 
    try {
      await api.post(
        `/comment/create`,
        { lawyerId: params.id, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      const commentsRes = await api.get(`/comment/lawyer/${params.id}`);
      setComments(commentsRes.data);
    } catch (error) {
      alert('Failed to add comment');
    }
  };
 
  if (loading) return <LoadingSpinner />;
  if (!lawyer) return <div className="text-center py-12">Lawyer not found</div>;
 
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Lawyer Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <img
                src={lawyer.profilePicture || 'https://via.placeholder.com/150'}
                alt={lawyer.fullName}
                className="w-40 h-40 rounded-full object-cover mb-4"
              />
              {lawyer.status === 'busy' && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Busy
                </span>
              )}
            </div>
 
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{lawyer.fullName}</h1>
              <p className="text-xl text-blue-600 font-semibold mb-4">{lawyer.specialization}</p>
              <p className="text-gray-600 mb-4">{lawyer.bio}</p>
 
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600">Hourly Rate</p>
                  <p className="text-2xl font-bold text-gray-800">${lawyer.hourlyRate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Hires</p>
                  <p className="text-2xl font-bold text-gray-800">{lawyer.totalHires}</p>
                </div>
              </div>
 
              <button
                onClick={() => setShowHireModal(true)}
                disabled={lawyer.status === 'busy'}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                Hire Now
              </button>
            </div>
          </div>
        </div>
 
        {/* Comments Section */}
        {canComment && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Leave a Comment</h2>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="4"
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Add Comment
            </button>
          </div>
        )}
 
        {/* Comments Display */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Comments ({comments.length})</h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-semibold text-gray-800">{comment.userId?.fullName || 'Anonymous'}</p>
                <p className="text-gray-600">{comment.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
 
        {/* Hire Modal */}
        {showHireModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Hire</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to hire {lawyer.fullName}? Your hourly rate is ${lawyer.hourlyRate}.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowHireModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleHire}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}