import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Star, Briefcase, Edit3, Save, X, Camera, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Helper } from '../../types';
import { mockReviews } from '../../data/mockData';

interface ProfilePageProps {
  onPageChange: (page: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onPageChange }) => {
  const { user, isHelper } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    zipCode: user?.zipCode || '',
    bio: isHelper && (user as Helper)?.bio ? (user as Helper).bio : '',
    hourlyRate: isHelper && (user as Helper)?.hourlyRate ? (user as Helper).hourlyRate.toString() : ''
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Login Required</h2>
          <button
            onClick={() => onPageChange('login')}
            className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const userReviews = mockReviews.filter(review => review.revieweeId === user.id);
  const averageRating = userReviews.length > 0 
    ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length 
    : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // In a real app, save changes to backend
    console.log('Saving profile changes:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      zipCode: user?.zipCode || '',
      bio: isHelper && (user as Helper)?.bio ? (user as Helper).bio : '',
      hourlyRate: isHelper && (user as Helper)?.hourlyRate ? (user as Helper).hourlyRate.toString() : ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => onPageChange('home')}
          className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={user.avatar || `https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop`}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-stone-50 transition-colors">
                    <Camera className="w-4 h-4 text-stone-600" />
                  </button>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <p className="text-emerald-100">
                    {isHelper ? 'Helper' : 'Task Poster'} • Joined {formatDate(user.createdAt)}
                  </p>
                  {isHelper && (
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-medium">
                          {averageRating > 0 ? averageRating.toFixed(1) : 'New'}
                        </span>
                      </div>
                      <div className="text-emerald-100">
                        {(user as Helper).completedJobs} jobs completed
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white bg-opacity-20 text-white font-medium rounded-lg hover:bg-opacity-30 transition-colors flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-stone-900 mb-4">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-stone-50 rounded-lg">
                        <User className="w-5 h-5 text-stone-400" />
                        <span className="text-stone-900">{user.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-stone-50 rounded-lg">
                        <Mail className="w-5 h-5 text-stone-400" />
                        <span className="text-stone-900">{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-stone-50 rounded-lg">
                        <Phone className="w-5 h-5 text-stone-400" />
                        <span className="text-stone-900">{user.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Zip Code</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-stone-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-stone-400" />
                        <span className="text-stone-900">{user.zipCode}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex-1 py-2 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 py-2 px-4 border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Helper-specific information */}
              {isHelper && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-stone-900 mb-4">Helper Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Hourly Rate</label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="hourlyRate"
                          value={formData.hourlyRate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          min="15"
                          max="200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-stone-50 rounded-lg">
                          <span className="text-2xl font-bold text-emerald-600">${(user as Helper).hourlyRate}</span>
                          <span className="text-stone-600">per hour</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {(user as Helper).skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Bio</label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                          placeholder="Tell potential clients about your experience..."
                        />
                      ) : (
                        <div className="p-3 bg-stone-50 rounded-lg">
                          <p className="text-stone-900">{(user as Helper).bio || 'No bio available'}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-stone-900">{(user as Helper).completedJobs}</div>
                        <div className="text-sm text-stone-600">Jobs Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span className="text-2xl font-bold text-stone-900">
                            {averageRating > 0 ? averageRating.toFixed(1) : 'New'}
                          </span>
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="text-sm text-stone-600">{userReviews.length} Reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            {isHelper && userReviews.length > 0 && (
              <div className="mt-8 pt-8 border-t border-stone-200">
                <h2 className="text-xl font-semibold text-stone-900 mb-6">Recent Reviews</h2>
                <div className="space-y-4">
                  {userReviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="bg-stone-50 rounded-lg p-4">
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-stone-600 ml-2">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <p className="text-stone-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;