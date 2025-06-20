import React, { useState } from 'react';
import { Mail, Lock, User, MapPin, Phone, Eye, EyeOff, ArrowLeft, Wrench, Home, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { TASK_CATEGORIES } from '../../types';
import { supabase } from '../../lib/supabase';

interface SignupPageProps {
  onPageChange: (page: string) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onPageChange }) => {
  const { register, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<'poster' | 'helper' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zipCode: '',
    password: '',
    confirmPassword: '',
    // Helper-specific fields for future use
    skills: [] as string[],
    serviceArea: [] as string[],
    hourlyRate: '',
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (!userType) {
        setError('Please select an account type');
        return;
      }
      setCurrentStep(2);
      setError('');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // First, register the user with Supabase Auth
      const result = await register(
        formData.email,
        formData.password,
        formData.name,
        userType!
      );
      
      if (result.success) {
        // Always show the email confirmation message for now
        // since email confirmation is enabled on this Supabase project
        setSuccessMessage('Account created successfully! Please check your email for a confirmation link. You must confirm your email before you can sign in.');
        setIsSubmitted(true);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSkillToggle = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.includes(skill)
        ? formData.skills.filter(s => s !== skill)
        : [...formData.skills, skill]
    });
  };

  const renderStep1 = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-stone-900 mb-2">Join Rent-a-Husband</h2>
        <p className="text-stone-600">Choose how you'd like to use our platform</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          type="button"
          onClick={() => setUserType('poster')}
          className={`p-6 border-2 rounded-xl text-left transition-all duration-200 ${
            userType === 'poster'
              ? 'border-emerald-500 bg-emerald-50 shadow-md'
              : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${userType === 'poster' ? 'bg-emerald-500' : 'bg-stone-400'}`}>
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-900">I Need Help</h3>
              <p className="text-stone-600 text-sm mt-1">
                Post tasks and find helpers for household jobs like AC maintenance, installations, and repairs.
              </p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-stone-500">
                <span>• Post tasks for free</span>
                <span>• Browse verified helpers</span>
                <span>• Get quotes instantly</span>
              </div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setUserType('helper')}
          className={`p-6 border-2 rounded-xl text-left transition-all duration-200 ${
            userType === 'helper'
              ? 'border-emerald-500 bg-emerald-50 shadow-md'
              : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${userType === 'helper' ? 'bg-emerald-500' : 'bg-stone-400'}`}>
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-900">I Want to Help</h3>
              <p className="text-stone-600 text-sm mt-1">
                Offer your skills and earn money helping neighbors with their household tasks and projects.
              </p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-stone-500">
                <span>• Set your own rates</span>
                <span>• Choose your schedule</span>
                <span>• Build your reputation</span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!userType}
        className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Continue
      </button>
    </form>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-stone-900 mb-2">
          {userType === 'helper' ? 'Helper Registration' : 'Create Your Account'}
        </h2>
        <p className="text-stone-600">
          {userType === 'helper' 
            ? 'Start with your basic information' 
            : 'Fill in your details to get started'
          }
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-lg border border-stone-300 px-3 py-3 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-lg border border-stone-300 px-3 py-3 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-lg border border-stone-300 px-3 py-3 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-stone-700 mb-2">
              Zip Code
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                required
                value={formData.zipCode}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-lg border border-stone-300 px-3 py-3 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                placeholder="90210"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 block w-full rounded-lg border border-stone-300 px-3 py-3 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pl-10 pr-10 block w-full rounded-lg border border-stone-300 px-3 py-3 text-stone-900 placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 transition-colors"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {userType === 'helper' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> After creating your account, you'll be able to complete your helper profile with skills, hourly rate, and other details from your dashboard.
            </p>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="flex-1 py-3 px-4 border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  );

  if (isSubmitted && successMessage) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Account Created!</h2>
          <p className="text-stone-600 mb-6">{successMessage}</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <button
          onClick={() => onPageChange('home')}
          className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white shadow-xl rounded-2xl p-8 border border-stone-200">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
              }`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-stone-600">
              <span>Account Type</span>
              <span>Details</span>
            </div>
          </div>

          {currentStep === 1 ? renderStep1() : renderStep2()}

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-600">
              Already have an account?{' '}
              <button
                onClick={() => onPageChange('login')}
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;