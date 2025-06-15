import React, { useState } from 'react';
import { Home, Plus, Search, Briefcase, MessageCircle, User, Menu, X, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const { user, logout, isHelper } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    ...(user ? [
      { id: 'post-task', label: isHelper ? 'Find Tasks' : 'Post Task', icon: isHelper ? Search : Plus },
      { id: 'my-jobs', label: 'My Jobs', icon: Briefcase },
      { id: 'messages', label: 'Messages', icon: MessageCircle },
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'support', label: 'Support', icon: HelpCircle }
    ] : [])
  ];

  const handleNavClick = (pageId: string) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2 text-stone-800 hover:text-emerald-600 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Rent-a-Husband</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    currentPage === item.id
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {user ? (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-stone-200">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar || `https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-stone-700">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-stone-200">
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-stone-600 hover:text-stone-900 p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-200 py-2">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-4 py-3 text-left flex items-center space-x-3 transition-colors ${
                      currentPage === item.id
                        ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              {user ? (
                <div className="px-4 py-3 border-t border-stone-200 mt-2">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={user.avatar || `https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-stone-900">{user.name}</div>
                      <div className="text-sm text-stone-500">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-4 py-3 border-t border-stone-200 mt-2 space-y-2">
                  <button
                    onClick={() => handleNavClick('login')}
                    className="w-full px-4 py-2 text-center font-medium text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavClick('signup')}
                    className="w-full px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;