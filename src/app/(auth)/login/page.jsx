'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/app/lib/api';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // মূল ব্যাকগ্রাউন্ড উইন্ডো - গ্লোবাল সিএসএস ব্রেক করার জন্য প্রটেক্টেড ফ্লেক্স লেআউট
    <div className="!w-full !min-h-screen bg-slate-50 flex !items-center !justify-center p-4 sm:p-8">
      
      {/* সেন্ট্রাল মডার্ন কার্ড কন্টেইনার */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-gray-200/60 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50"
      >
        {/* হেডার এরিয়া */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            Login to your LegalEase account to continue.
          </p>
        </div>

        {/* এরর এলার্ট বক্স */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl mb-6 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* লগইন ফর্ম বডি */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-5">
          
          {/* ১. Email Input Box */}
          <div className="flex flex-col">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="!w-full !block px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-medium"
              required
            />
          </div>

          {/* ২. Password Input Box */}
          <div className="flex flex-col">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="!w-full !block px-4 py-3 rounded-xl bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-medium"
              required
            />
          </div>

          {/* অ্যাকশন সাবমিট বাটন উইথ লাইভ স্পিনার */}
          <button
            type="submit"
            disabled={loading}
            className="!w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-blue-600/10 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all mt-3 text-center block"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2 mx-auto">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </span>
            ) : (
              'Login Account'
            )}
          </button>
        </form>

        {/* ফুটার ট্রান্সফার লিংক */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-sm text-slate-500 font-medium">
          Do not have an account?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline transition ml-1">
            Register here
          </Link>
        </div>

      </motion.div>
    </div>
  );
}