'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ব্রাউজারে localStorage থেকে টোকেন বা ইউজার ডেটা চেক করার জন্য
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (token && savedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
      }
    }
    setLoading(false);
  }, []);

  // লগইন ফাংশন
  const login = (userData, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setUser(userData);
  };

  // লগআউট ফাংশন
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setUser(null);
  };

  // Navbar বা অন্যান্য ফাইলে যা যা প্রয়োজন, তা রিটার্ন করা হচ্ছে
  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
}