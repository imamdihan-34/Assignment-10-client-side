'use client';
import { useState, useEffect } from 'react';
import DashboardSidebar from '@/app/components/DashboardSidebar';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { api } from '@/app/lib/api';
import { useAuth } from '@/app/hooks/useAuth';
 
export default function ManageLegalProfile() {
  const { token, user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    specialization: '',
    bio: '',
    hourlyRate: 0,
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
 
  useEffect(() => {
    if (!token || !user) return;
 
    const fetchServices = async () => {
      try {
        const response = await api.get('/lawyer/my-services', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchServices();
  }, [token, user]);
 
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
 
    let imageUrl = formData.image;
    if (imageFile) {
      imageUrl = await handleImageUpload(imageFile);
      if (!imageUrl) {
        alert('Failed to upload image');
        return;
      }
    }
 
    const payload = {
      ...formData,
      profilePicture: imageUrl
    };
 
    try {
      if (editingId) {
        await api.put(`/lawyer/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post('/lawyer/create-service', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setFormData({ specialization: '', bio: '', hourlyRate: 0, image: '' });
      setImageFile(null);
      setShowForm(false);
      setEditingId(null);
 
      const response = await api.get('/lawyer/my-services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(response.data);
    } catch (error) {
      alert('Failed to save service');
    }
  };
 
  const handleDelete = async (serviceId) => {
    if (!confirm('Are you sure?')) return;
 
    try {
      await api.delete(`/lawyer/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(services.filter(s => s._id !== serviceId));
    } catch (error) {
      alert('Failed to delete service');
    }
  };
 
  if (loading) return <LoadingSpinner />;
 
  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Legal Services</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ specialization: '', bio: '', hourlyRate: 0, image: '' });
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : 'Add Service'}
          </button>
        </div>
 
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Specialization</label>
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Tax Law">Tax Law</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="IP Law">IP Law</option>
                </select>
              </div>
 
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>
 
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
 
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
 
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {editingId ? 'Update Service' : 'Add Service'}
              </button>
            </form>
          </div>
        )}
 
        {services.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No services yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {services.map((service) => (
              <div key={service._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{service.specialization}</h3>
                  <p className="text-2xl font-bold text-blue-600">${service.hourlyRate}/hr</p>
                </div>
                <p className="text-gray-600 mb-4">{service.bio}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(service._id);
                      setFormData({
                        specialization: service.specialization,
                        bio: service.bio,
                        hourlyRate: service.hourlyRate,
                        image: service.profilePicture
                      });
                      setShowForm(true);
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}