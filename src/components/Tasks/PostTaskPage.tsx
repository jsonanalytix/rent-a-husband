import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, MapPin, Plus, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { TASK_CATEGORIES } from '../../types';
import { taskService } from '../../services/taskService';

interface PostTaskPageProps {
  onPageChange: (page: string) => void;
}

const PostTaskPage: React.FC<PostTaskPageProps> = ({ onPageChange }) => {
  const { user, isHelper, loading } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    budgetType: 'fixed' as 'fixed' | 'hourly',
    preferredDate: '',
    preferredTime: 'morning',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await taskService.createTask({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        budget_type: formData.budgetType,
        preferred_date: formData.preferredDate || null,
        preferred_time: formData.preferredTime || null,
        location: {
          address: formData.location.address,
          city: formData.location.city,
          state: formData.location.state,
          zip_code: formData.location.zipCode
        }
      });

      if (result.error) {
        setError(result.error);
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Login Required</h2>
          <p className="text-stone-600 mb-6">You need to be logged in to post a task.</p>
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

  if (isHelper) {
    return (
      <div className="min-h-screen bg-stone-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Browse Available Tasks</h2>
            <p className="text-stone-600 mb-6">As a helper, you can browse and apply for tasks posted by others.</p>
            <button
              onClick={() => onPageChange('my-jobs')}
              className="py-3 px-6 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              View Available Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Task Posted Successfully!</h2>
          <p className="text-stone-600 mb-6">
            Your task has been posted and helpers in your area will be notified. You'll start receiving applications soon.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => onPageChange('my-jobs')}
              className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              View My Tasks
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  title: '',
                  description: '',
                  category: '',
                  budget: '',
                  budgetType: 'fixed',
                  preferredDate: '',
                  preferredTime: 'morning',
                  location: {
                    address: '',
                    city: '',
                    state: '',
                    zipCode: ''
                  }
                });
              }}
              className="w-full py-3 px-4 border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-50 transition-colors"
            >
              Post Another Task
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => onPageChange('home')}
          className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Post a New Task</h1>
            <p className="text-emerald-100 mt-2">Describe what you need help with and get matched with skilled helpers.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-2">
                Task Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                placeholder="e.g., Replace HVAC Air Filter, Install New Dishwasher"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-stone-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
              >
                <option value="">Select a category</option>
                {TASK_CATEGORIES.map((category) => (
                  <option key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-2">
                Task Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleInputChange}
                className="block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors resize-none"
                placeholder="Provide details about what needs to be done, any tools/materials needed, and specific requirements..."
              />
              <p className="mt-2 text-sm text-stone-500">Be specific about what you need help with to attract the right helpers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-stone-700 mb-2">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                  <input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="pl-10 block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-stone-700 mb-2">
                  Preferred Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="pl-10 block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                  >
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="evening">Evening (5PM - 8PM)</option>
                    <option value="weekend">Weekend</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-stone-700 mb-3">Task Location *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input
                    name="location.address"
                    type="text"
                    required
                    value={formData.location.address}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                    placeholder="Street Address"
                  />
                </div>
                <div>
                  <input
                    name="location.city"
                    type="text"
                    required
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                    placeholder="City"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="location.state"
                    type="text"
                    required
                    maxLength={2}
                    value={formData.location.state}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                    placeholder="State"
                  />
                  <input
                    name="location.zipCode"
                    type="text"
                    required
                    pattern="[0-9]{5}"
                    value={formData.location.zipCode}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-stone-700 mb-2">
                Budget (Optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                  <input
                    id="budget"
                    name="budget"
                    type="number"
                    min="10"
                    max="10000"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="pl-10 block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                    placeholder="50"
                  />
                </div>
                <select
                  name="budgetType"
                  value={formData.budgetType}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>
              <p className="mt-2 text-sm text-stone-500">Leave blank to let helpers bid on your task.</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-800 mb-2">💡 Tips for a great task post:</h3>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Be specific about what needs to be done</li>
                <li>• Mention if you have tools/materials or if helper should bring them</li>
                <li>• Include any access requirements (stairs, parking, etc.)</li>
                <li>• Set realistic timelines and budgets</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-4 px-6 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Posting Task...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Post Task</span>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostTaskPage;