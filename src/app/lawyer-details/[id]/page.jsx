'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function LawyerDetailsPage() {
  const params = useParams();
  const { id } = params;
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        console.log('Fetching lawyer with ID:', id);
                

        const response = await fetch(`http://localhost:5000/api/lawyer/${id}`);
        if (!response.ok) {
          throw new Error('Lawyer not found');
        }

        const data = await response.json();
        console.log('Lawyer data:', data);
        setLawyer(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Failed to load lawyer details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLawyer();
    }
  }, [id]);

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl font-medium">{error}</div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-xl font-medium">Lawyer not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          className="bg-white rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-8 mb-8 items-center sm:items-start">
            <img
              src={lawyer.profilePicture || 'https://i.pravatar.cc/150'}
              alt={lawyer.fullName || 'Lawyer Profile'}
              className="w-32 h-32 rounded-full object-cover border"
              onError={(e) => {
                // ইমেজ লোড হতে ফেল করলে ব্যাকআপ ইমেজ শো করবে
                e.target.src = 'https://i.pravatar.cc/150';
              }}
            />
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-4xl font-bold mb-2">{lawyer.fullName}</h1>
              <p className="text-2xl text-blue-600 font-semibold mb-4">
                {lawyer.specialization}
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm sm:text-base">
                <div>
                  <p className="text-gray-500">Experience</p>
                  <p className="text-xl font-bold">{lawyer.experience || 0} years</p>
                </div>
                <div>
                  <p className="text-gray-500">Hourly Rate</p>
                  <p className="text-xl font-bold">${lawyer.hourlyRate || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Rating</p>
                  <p className="text-xl font-bold">⭐ {lawyer.averageRating || 'N/A'}</p>
                </div>
              </div>

              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-full sm:w-auto">
                Hire Now
              </button>
            </div>
          </div>

          {/* Bio */}
          <div className="border-t pt-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{lawyer.bio || 'No bio available.'}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 border-t pt-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 font-medium">Total Hirings</p>
              <p className="text-3xl font-bold text-blue-600">{lawyer.totalHirings || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600 font-medium">Average Rating</p>
              <p className="text-3xl font-bold text-green-600">⭐ {lawyer.averageRating || '0'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}