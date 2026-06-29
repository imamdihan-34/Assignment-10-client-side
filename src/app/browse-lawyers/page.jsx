'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LawyerCard from '@/app/components/LawyerCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { api } from '@/app/lib/api';
 
export default function BrowseLawyers() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    minFee: 0,
    maxFee: 500,
    availability: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
 
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await api.get('/lawyer/all');
        setLawyers(response.data);
        setFilteredLawyers(response.data);
      } catch (error) {
        console.error('Failed to fetch lawyers:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchLawyers();
  }, []);
 
  useEffect(() => {
    let filtered = lawyers;
 
    if (filters.search) {
      filtered = filtered.filter(
        (lawyer) =>
          lawyer.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
          lawyer.specialization.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
 
    if (filters.specialization) {
      filtered = filtered.filter((lawyer) => lawyer.specialization === filters.specialization);
    }
 
    filtered = filtered.filter(
      (lawyer) => lawyer.hourlyRate >= filters.minFee && lawyer.hourlyRate <= filters.maxFee
    );
 
    if (filters.availability !== 'all') {
      filtered = filtered.filter((lawyer) => lawyer.status === filters.availability);
    }
 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredLawyers(filtered);
    setCurrentPage(1);
  }, [filters, lawyers]);
 
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };
 
  const totalPages = Math.ceil(filteredLawyers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLawyers = filteredLawyers.slice(startIndex, startIndex + itemsPerPage);
 
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Browse Lawyers</h1>
 
        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Search</label>
            <input
              type="text"
              placeholder="Name or specialization"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
 
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Specialization</label>
            <select
              value={filters.specialization}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="Criminal Law">Criminal Law</option>
              <option value="Corporate Law">Corporate Law</option>
              <option value="Family Law">Family Law</option>
              <option value="Tax Law">Tax Law</option>
              <option value="Real Estate">Real Estate</option>
              <option value="IP Law">IP Law</option>
            </select>
          </div>
 
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Max Fee: ${filters.maxFee}</label>
            <input
              type="range"
              min="0"
              max="500"
              value={filters.maxFee}
              onChange={(e) => handleFilterChange('maxFee', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
 
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Availability</label>
            <select
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
            </select>
          </div>
 
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ search: '', specialization: '', minFee: 0, maxFee: 500, availability: 'all' })}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>
 
        {/* Results */}
        {loading ? (
          <LoadingSpinner />
        ) : paginatedLawyers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No lawyers found matching your criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedLawyers.map((lawyer) => (
                <LawyerCard key={lawyer._id} lawyer={lawyer} />
              ))}
            </div>
 
            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}