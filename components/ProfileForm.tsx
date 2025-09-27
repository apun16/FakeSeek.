'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

interface UserProfile {
  _id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  profileImage1?: string;
  profileImage2?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProfileForm() {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profileImage1: '',
    profileImage2: '',
  });

  const [imageFiles, setImageFiles] = useState({
    image1: null as File | null,
    image2: null as File | null,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      
      if (data.profile) {
        setProfile(data.profile);
        setFormData({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          profileImage1: data.profile.profileImage1 || '',
          profileImage2: data.profile.profileImage2 || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageKey: 'image1' | 'image2') => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFiles(prev => ({
        ...prev,
        [imageKey]: file
      }));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // For now, we'll convert to base64 and store as string
    // In production, you'd want to upload to a cloud storage service
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      let profileImage1 = formData.profileImage1;
      let profileImage2 = formData.profileImage2;

      // Upload images if new files are selected
      if (imageFiles.image1) {
        profileImage1 = await uploadImage(imageFiles.image1);
      }
      if (imageFiles.image2) {
        profileImage2 = await uploadImage(imageFiles.image2);
      }

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          profileImage1,
          profileImage2,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.profile);
        setMessage('Profile saved successfully!');
        setImageFiles({ image1: null, image2: null });
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 border border-white/20 rounded-lg p-6">
      <h3 className="text-xl font-oswald font-bold text-white mb-6">
        Complete Your Profile
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-author font-medium text-white mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
              placeholder="Enter your first name"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-author font-medium text-white mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="image1" className="block text-sm font-author font-medium text-white mb-2">
              Profile Image 1
            </label>
            <input
              type="file"
              id="image1"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'image1')}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-author file:bg-orange file:text-white hover:file:bg-orange/80"
            />
            {formData.profileImage1 && !imageFiles.image1 && (
              <div className="mt-2">
                <img 
                  src={formData.profileImage1} 
                  alt="Current profile image 1" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="image2" className="block text-sm font-author font-medium text-white mb-2">
              Profile Image 2
            </label>
            <input
              type="file"
              id="image2"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'image2')}
              className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-author file:bg-orange file:text-white hover:file:bg-orange/80"
            />
            {formData.profileImage2 && !imageFiles.image2 && (
              <div className="mt-2">
                <img 
                  src={formData.profileImage2} 
                  alt="Current profile image 2" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm font-author ${
            message.includes('Error') 
              ? 'bg-red-500/20 text-red-300 border border-red-500/50' 
              : 'bg-green-500/20 text-green-300 border border-green-500/50'
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-orange hover:bg-orange/80 disabled:bg-orange/50 text-white px-6 py-3 rounded-lg font-author font-medium transition-colors duration-200"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}