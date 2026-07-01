'use client'
import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
 
export function useFetch(url, token = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await api.get(url, { headers });
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, [url, token]);
 
  return { data, loading, error };
}
 