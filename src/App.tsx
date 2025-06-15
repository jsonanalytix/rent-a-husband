import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import PostTaskPage from './components/Tasks/PostTaskPage';
import MyJobsPage from './components/Jobs/MyJobsPage';
import MessagesPage from './components/Messages/MessagesPage';
import ProfilePage from './components/Profile/ProfilePage';
import SupportPage from './components/Support/SupportPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'login':
        return <LoginPage onPageChange={setCurrentPage} />;
      case 'signup':
        return <SignupPage onPageChange={setCurrentPage} />;
      case 'post-task':
        return <PostTaskPage onPageChange={setCurrentPage} />;
      case 'my-jobs':
        return <MyJobsPage onPageChange={setCurrentPage} />;
      case 'messages':
        return <MessagesPage onPageChange={setCurrentPage} />;
      case 'profile':
        return <ProfilePage onPageChange={setCurrentPage} />;
      case 'support':
        return <SupportPage onPageChange={setCurrentPage} />;
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-stone-50">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        {renderPage()}
      </div>
    </AuthProvider>
  );
}

export default App;