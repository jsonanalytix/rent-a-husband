import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onPageChange: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onPageChange }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        onPageChange('home');
      } else {
        setError('Invalid email or password. Try: sarah@example.com or mike@example.com');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const demoAccounts = [
    { email: 'sarah@example.com', type: 'Helper Account' },
    { email: 'mike@example.com', type: 'Helper Account' },
    { email: 'emily@example.com', type: 'Task Poster Account' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-stone-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Sign in to your account to continue
            </p>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 border border-stone-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

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
                  placeholder="your@email.com"
                />
              </div>
            </div>

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
                  placeholder="Your password"
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

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-stone-500">Don't have an account?</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => onPageChange('signup')}
                className="w-full flex justify-center py-3 px-4 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 transition-colors"
              >
                Create New Account
              </button>
            </div>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-emerald-800 mb-3">Demo Accounts</h3>
          <div className="space-y-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => setFormData({ ...formData, email: account.email, password: 'password' })}
                className="w-full text-left p-2 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <div className="text-sm font-medium text-emerald-700">{account.email}</div>
                <div className="text-xs text-emerald-600">{account.type}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-emerald-600 mt-3">
            Click any account above to auto-fill the form. Password: "password"
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;