'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LawyerCard({ lawyer }) {
  const router = useRouter();

  const handleViewDetails = () => {
    console.log('Viewing lawyer:', lawyer._id);
    router.push(`/lawyer-details/${lawyer._id}`);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
      onClick={handleViewDetails}
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <img
          src={lawyer.profilePicture || 'https://i.pravatar.cc/150'}
          alt={lawyer.fullName}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Available
        </div>
      </div>

      <div className="p-6">
        <p className="text-blue-600 font-semibold text-sm uppercase mb-2">
          {lawyer.specialization}
        </p>
        <h3 className="text-xl font-bold mb-2">{lawyer.fullName}</h3>
        <p className="text-gray-600 text-sm mb-4">Experience: {lawyer.experience} years</p>
        <p className="text-gray-700 mb-4">{lawyer.bio}</p>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm">HOURLY RATE</p>
            <p className="text-2xl font-bold">${lawyer.hourlyRate}/hr</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-sm">Rating</p>
            <p className="text-xl font-bold">⭐ {lawyer.averageRating}</p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}