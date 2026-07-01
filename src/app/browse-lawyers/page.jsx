'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LawyerCard from '@/app/components/LawyerCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function BrowseLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const specializations = [
    'All',
    'Criminal Law',
    'Corporate Law',
    'Family Law',
    'Tax Law',
    'Real Estate',
    'IP Law'
  ];

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/lawyer/all');
        if (response.ok) {
          const data = await response.json();
          setLawyers(data);
        }
      } catch (error) {
        console.error('Error fetching lawyers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...lawyers];

    // Filter by specialization
    if (selectedSpecialization !== 'All') {
      filtered = filtered.filter(
        (lawyer) => lawyer.specialization === selectedSpecialization
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((lawyer) =>
        lawyer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
    } else if (sortBy === 'experience') {
      filtered.sort((a, b) => b.experience - a.experience);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredLawyers(filtered);
  }, [lawyers, searchTerm, selectedSpecialization, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Browse Legal Professionals</h1>
          <p className="text-blue-100">Find the perfect lawyer for your needs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 sticky top-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-xl font-bold mb-6">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Search by Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., John Smith"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Specialization Filter */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  Specialization
                </label>
                <div className="space-y-2">
                  {specializations.map((spec) => (
                    <label key={spec} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="specialization"
                        value={spec}
                        checked={selectedSpecialization === spec}
                        onChange={(e) => setSelectedSpecialization(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">Highest Rating</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="experience">Most Experience</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialization('All');
                  setSortBy('rating');
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Clear Filters
              </button>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-bold text-gray-800">{filteredLawyers.length}</span> lawyers
              </p>
            </div>

            {/* Lawyers Grid */}
            {loading ? (
              <LoadingSpinner />
            ) : filteredLawyers.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredLawyers.map((lawyer, index) => (
                  <motion.div
                    key={lawyer._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <LawyerCard lawyer={lawyer} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-xl text-gray-600">
                  No lawyers found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}