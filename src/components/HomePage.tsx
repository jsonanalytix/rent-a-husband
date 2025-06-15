import React from 'react';
import { CheckCircle, Star, Users, Shield, ArrowRight, Wrench, Home as HomeIcon, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockHelpers, mockTasks } from '../data/mockData';

interface HomePageProps {
  onPageChange: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const { user } = useAuth();

  const features = [
    {
      icon: Shield,
      title: 'Verified Helpers',
      description: 'All helpers are background-checked and verified for your peace of mind.'
    },
    {
      icon: Star,
      title: 'Rated & Reviewed',
      description: 'Read real reviews from neighbors who have used our helpers.'
    },
    {
      icon: Clock,
      title: 'Same-Day Service',
      description: 'Many tasks can be completed the same day you post them.'
    },
    {
      icon: Users,
      title: 'Local Community',
      description: 'Connect with skilled helpers in your neighborhood.'
    }
  ];

  const categories = [
    { name: 'AC Check & Maintenance', count: 23, icon: '❄️' },
    { name: 'Dishwasher Installation', count: 18, icon: '🍽️' },
    { name: 'Air Filter Replacement', count: 15, icon: '💨' },
    { name: 'TV Mounting', count: 12, icon: '📺' },
    { name: 'Light Fixture Installation', count: 9, icon: '💡' },
    { name: 'Furniture Assembly', count: 7, icon: '🪑' }
  ];

  const stats = [
    { number: '500+', label: 'Tasks Completed' },
    { number: '4.9', label: 'Average Rating' },
    { number: '150+', label: 'Verified Helpers' },
    { number: '24h', label: 'Avg Response Time' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-emerald-50">
      {/* Development Notice */}
      <div className="bg-blue-600 text-white py-3 px-4 text-center">
        <p className="text-sm">
          <strong>Development Mode:</strong> Email confirmation is currently enabled. After signing up, check your email to confirm your account before logging in.
        </p>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-stone-900 leading-tight">
                  Need a Hand Around the House?
                </h1>
                <p className="text-xl text-stone-600 leading-relaxed">
                  Connect with trusted local helpers for all your household tasks. From AC checks to furniture assembly, we've got you covered.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onPageChange(user ? 'post-task' : 'signup')}
                  className="group px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Need a Hand? Post a Task Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onPageChange(user ? 'post-task' : 'signup')}
                  className="px-8 py-4 border-2 border-stone-300 text-stone-700 font-semibold rounded-xl hover:border-emerald-600 hover:text-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Wrench className="w-5 h-5" />
                  <span>Become a Helper</span>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-emerald-600">{stat.number}</div>
                    <div className="text-sm text-stone-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop"
                    alt="Helper"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-stone-900">Mike Rodriguez</div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-stone-600">4.9 • 127 jobs</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-stone-700">AC Check & Maintenance</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-stone-700">Licensed & Insured</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-stone-700">Same-day availability</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-stone-200">
                  <div className="text-2xl font-bold text-stone-900">$45/hour</div>
                  <div className="text-sm text-stone-600">Typical rate for AC maintenance</div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-10 blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full opacity-10 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-4">
              Why Choose Rent-a-Husband?
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              We make it easy and safe to get help with household tasks from trusted local professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-3">{feature.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16 lg:py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-4">
              Popular Task Categories
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              From routine maintenance to one-time installations, our helpers can handle it all.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-stone-200 hover:border-emerald-300 cursor-pointer group"
                onClick={() => onPageChange(user ? 'post-task' : 'signup')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{category.icon}</div>
                    <div>
                      <h3 className="font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-stone-600">{category.count} helpers available</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onPageChange(user ? 'post-task' : 'signup')}
              className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
            >
              View All Categories
            </button>
          </div>
        </div>
      </div>

      {/* Recent Tasks Preview */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-4">
              Recent Tasks in Your Area
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              See what your neighbors are working on and get inspired for your own projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {task.status === 'in-progress' ? 'In Progress' : task.status}
                  </span>
                  {task.budget && (
                    <span className="text-lg font-bold text-emerald-600">${task.budget}</span>
                  )}
                </div>
                
                <h3 className="font-semibold text-stone-900 mb-2 line-clamp-2">{task.title}</h3>
                <p className="text-stone-600 text-sm mb-4 line-clamp-3">{task.description}</p>
                
                <div className="flex items-center justify-between text-sm text-stone-500">
                  <span className="flex items-center space-x-1">
                    <HomeIcon className="w-4 h-4" />
                    <span>{task.location}</span>
                  </span>
                  <span>{task.applications.length} applications</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onPageChange(user ? 'post-task' : 'signup')}
              className="px-8 py-4 border-2 border-emerald-600 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300"
            >
              {user ? 'Browse All Tasks' : 'Sign Up to See More'}
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 lg:py-24 bg-gradient-to-r from-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Get Things Done?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of homeowners who have found reliable help for their household tasks.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onPageChange(user ? 'post-task' : 'signup')}
              className="px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-stone-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Post Your First Task
            </button>
            <button
              onClick={() => onPageChange(user ? 'post-task' : 'signup')}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-emerald-700 transition-all duration-300"
            >
              Start Helping Others
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;