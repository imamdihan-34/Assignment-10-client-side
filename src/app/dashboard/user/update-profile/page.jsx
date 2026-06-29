
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { api } from '@/app/lib/api';
import { useAuth } from '@/app/hooks/useAuth';
 
export default function UpdateProfile() {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    profilePicture: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
 
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        fullName: user.fullName,
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);
 
  const handleImageUpload = async (file) => {
    const formDataImg = new FormData();
    formDataImg.append('image', file);
 
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formDataImg
      });
      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    let profilePictureUrl = formData.profilePicture;
 
    if (imageFile) {
      profilePictureUrl = await handleImageUpload(imageFile);
      if (!profilePictureUrl) {
        alert('Failed to upload image');
        setLoading(false);
        return;
      }
    }
 
    try {
      await api.put(
        '/user/update-profile',
        {
          fullName: formData.fullName,
          profilePicture: profilePictureUrl
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Profile updated successfully');
      router.push('/dashboard');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Update Profile</h1>
 
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
 
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Profile Picture</label>
              {formData.profilePicture && (
                <img src={formData.profilePicture} alt="Profile" className="w-24 h-24 rounded-lg mb-4 object-cover" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
 
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}