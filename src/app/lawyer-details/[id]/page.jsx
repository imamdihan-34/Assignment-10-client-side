'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function LawyerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    description: '',
    duration: 1
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/lawyer/${id}`);
        
        if (!response.ok) {
          throw new Error('Lawyer not found');
        }

        const data = await response.json();
        setLawyer(data);
      } catch (err) {
        setError(err.message || 'Failed to load lawyer details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLawyer();
    }
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user._id) {
        router.push('/login');
        return;
      }

      const booking = {
        lawyerId: id,
        userId: user._id,
        date: bookingData.date,
        time: bookingData.time,
        description: bookingData.description,
        duration: bookingData.duration,
        totalPrice: lawyer.hourlyRate * bookingData.duration
      };

      // Save to localStorage (dummy implementation)
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push({
        ...booking,
        id: Date.now(),
        status: 'pending',
        lawyerName: lawyer.fullName,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('bookings', JSON.stringify(bookings));

      alert('Booking request sent successfully!');
      setShowBookingForm(false);
      setBookingData({ date: '', time: '', description: '', duration: 1 });
    } catch (err) {
      alert('Booking failed: ' + err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-xl">Lawyer not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header with photo and basic info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 border-b">
            <div className="md:col-span-1 flex justify-center">
              <img
                src={lawyer.profilePicture || 'https://i.pravatar.cc/200'}
                alt={lawyer.fullName}
                className="w-40 h-40 rounded-full object-cover"
              />
            </div>
            
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-2">{lawyer.fullName}</h1>
              <p className="text-2xl text-blue-600 font-semibold mb-4">
                {lawyer.specialization}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Experience</p>
                  <p className="text-2xl font-bold text-blue-600">{lawyer.experience} yrs</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Hourly Rate</p>
                  <p className="text-2xl font-bold text-green-600">${lawyer.hourlyRate}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">⭐ {lawyer.averageRating}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Total Hirings</p>
                  <p className="text-2xl font-bold text-purple-600">{lawyer.totalHirings}</p>
                </div>
              </div>

              <button
                onClick={() => setShowBookingForm(!showBookingForm)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
              >
                {showBookingForm ? 'Cancel' : 'Book Now'}
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="p-8 border-b">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{lawyer.bio}</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 p-8 border-b bg-gray-50">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{lawyer.experience}</p>
              <p className="text-gray-600">Years Experience</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{lawyer.totalHirings}</p>
              <p className="text-gray-600">Total Hirings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">⭐{lawyer.averageRating}</p>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>

          {/* Booking Form */}
          {showBookingForm && (
            <motion.div
              className="p-8 bg-blue-50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <h3 className="text-2xl font-bold mb-6">Book a Consultation</h3>
              
              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Date</label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Time</label>
                    <input
                      type="time"
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={bookingData.duration}
                    onChange={(e) => setBookingData({ ...bookingData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea
                    value={bookingData.description}
                    onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                    placeholder="Describe your legal issue..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-600">Total Cost:</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${lawyer.hourlyRate * bookingData.duration}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}