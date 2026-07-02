'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import LawyerCard from '@/app/components/LawyerCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function Home() {
  const [featuredLawyers, setFeaturedLawyers] = useState([]);
  const [topLawyers, setTopLawyers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiUrl = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lawyer/all`)
        const [featuredRes, topRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lawyer/featured`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lawyer/top`)
        ]);

        if (featuredRes.ok) {
          const featured = await featuredRes.json();
          setFeaturedLawyers(featured || []);
        }

        if (topRes.ok) {
          const top = await topRes.json();
          setTopLawyers(top || []);
        }

        setCategories(['Criminal Law', 'Corporate Law', 'Family Law', 'Tax Law', 'Real Estate', 'IP Law']);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="w-full bg-gray-50/50 min-h-screen font-sans antialiased flex flex-col items-center justify-start overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find & Hire Expert Legal Counsel
          </motion.h1>
          
          <motion.p
            className="text-base sm:text-lg md:text-xl mb-10 text-blue-100 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Connect with top-tier legal professionals for your needs.
          </motion.p>
          
          <motion.button
            onClick={() => router.push('/browse-lawyers')}
            className="inline-flex items-center bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Browse Lawyers →
          </motion.button>
        </div>
      </section>

      {/* Featured Lawyers */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Legal Specialists</h2>
        
        {loading ? (
          <LoadingSpinner />
        ) : featuredLawyers.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredLawyers.map((lawyer) => (
              <motion.div key={lawyer._id} variants={itemVariants}>
                <LawyerCard lawyer={lawyer} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-600">No featured lawyers</p>
        )}
      </section>

      {/* Top Lawyers */}
      <section className="w-full bg-white py-20 border-y">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Top Legal Experts</h2>
          
          {loading ? (
            <LoadingSpinner />
          ) : topLawyers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topLawyers.map((lawyer) => (
                <LawyerCard key={lawyer._id} lawyer={lawyer} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No top lawyers</p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Practice Areas</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => router.push(`/browse-lawyers?cat=${cat}`)}
              className="p-4 border rounded-lg hover:shadow-md transition text-sm font-bold"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}