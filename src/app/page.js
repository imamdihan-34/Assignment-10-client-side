'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import LawyerCard from '@/app/components/LawyerCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';

// API call function
const fetchLawyers = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    console.log('API URL:', apiUrl);

    const featuredRes = await fetch(`${apiUrl}/lawyer/featured`);
    const topRes = await fetch(`${apiUrl}/lawyer/top`);

    if (!featuredRes.ok || !topRes.ok) {
      throw new Error('Failed to fetch lawyers');
    }

    const featured = await featuredRes.json();
    const top = await topRes.json();

    return { featured: featured || [], top: top || [] };
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    return { featured: [], top: [] };
  }
};

export default function Home() {
  const [featuredLawyers, setFeaturedLawyers] = useState([]);
  const [topLawyers, setTopLawyers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLawyers();
        setFeaturedLawyers(data.featured);
        setTopLawyers(data.top);
        setCategories(['Criminal Law', 'Corporate Law', 'Family Law', 'Tax Law', 'Real Estate', 'IP Law']);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadData, 500);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="w-full bg-gray-50/50 min-h-screen font-sans antialiased flex flex-col items-center justify-start overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-20 md:py-28 flex justify-center items-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find & Hire Expert <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">Legal Counsel</span>
          </motion.h1>
          
          <motion.p
            className="text-base sm:text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto font-medium text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect with top-tier, verified legal professionals tailored to your specific judicial and business requirements.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <button
              onClick={() => router.push('/browse-lawyers')}
              className="inline-flex items-center justify-center bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-blue-900/20 hover:bg-blue-50 active:scale-[0.98] transition-all duration-200"
            >
              Browse Available Lawyers
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Lawyers Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight">
            Featured Legal Specialists
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Highly recommended professionals with proven track records of success across diverse legal fields.
          </p>
        </div>

        {loading ? (
          <div className="py-12"><LoadingSpinner /></div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {featuredLawyers.length > 0 ? (
              featuredLawyers.map((lawyer) => (
                <motion.div key={lawyer._id} variants={itemVariants} className="h-full">
                  <LawyerCard lawyer={lawyer} />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600">No featured lawyers available</p>
            )}
          </motion.div>
        )}
      </section>

      {/* Top Legal Experts Section */}
      <section className="w-full bg-white border-y border-gray-100 py-20 flex justify-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Top Corporate & Trial Experts
            </h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {loading ? (
            <div className="py-12"><LoadingSpinner /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full">
              {topLawyers.length > 0 ? (
                topLawyers.map((lawyer, index) => (
                  <motion.div
                    key={lawyer._id}
                    className="h-full"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <LawyerCard lawyer={lawyer} />
                  </motion.div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-600">No top lawyers available</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Legal Categories Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mb-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Explore Practices By Category
          </h2>
          <p className="mt-3 text-base text-gray-500 max-w-2xl mx-auto">
            Quickly locate legal services structured around specialized divisions of law.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 w-full">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-white border border-gray-100 p-5 rounded-xl text-center cursor-pointer shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-600 transition-all duration-200 flex items-center justify-center min-h-[100px]"
              whileHover={{ y: -5 }}
              onClick={() => router.push(`/browse-lawyers?category=${category}`)}
            >
              <p className="font-bold text-sm text-gray-800 leading-tight select-none">
                {category}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}