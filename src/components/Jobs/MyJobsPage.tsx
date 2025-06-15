import React, { useState } from 'react';
import { Calendar, MapPin, DollarSign, Clock, Users, Star, MessageCircle, ArrowLeft, Eye, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockTasks, mockHelpers, mockUsers } from '../../data/mockData';
import { Task, Helper, Application } from '../../types';

interface MyJobsPageProps {
  onPageChange: (page: string) => void;
}

const MyJobsPage: React.FC<MyJobsPageProps> = ({ onPageChange }) => {
  const { user, isHelper } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'applications'>('active');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Login Required</h2>
          <p className="text-stone-600 mb-6">You need to be logged in to view your jobs.</p>
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

  // Filter tasks based on user role
  const userTasks = isHelper 
    ? mockTasks.filter(task => task.status === 'open' || task.helperId === user.id)
    : mockTasks.filter(task => task.posterId === user.id);

  const getTasksByStatus = (status: string) => {
    switch (status) {
      case 'active':
        return userTasks.filter(task => task.status === 'open' || task.status === 'in-progress');
      case 'completed':
        return userTasks.filter(task => task.status === 'completed');
      case 'applications':
        return userTasks.filter(task => task.applications.length > 0);
      default:
        return [];
    }
  };

  const getHelperById = (id: string): Helper | undefined => {
    return mockHelpers.find(helper => helper.id === id);
  };

  const getUserById = (id: string) => {
    return [...mockUsers, ...mockHelpers].find(u => u.id === id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'open':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  const tabs = [
    { id: 'active', label: isHelper ? 'Available & Active' : 'Active Tasks', count: getTasksByStatus('active').length },
    { id: 'completed', label: 'Completed', count: getTasksByStatus('completed').length },
    ...(isHelper ? [] : [{ id: 'applications', label: 'Applications', count: getTasksByStatus('applications').length }])
  ];

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const helper = task.helperId ? getHelperById(task.helperId) : null;
    const poster = getUserById(task.posterId);

    return (
      <div className="bg-white border border-stone-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-stone-900 line-clamp-2">{task.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status === 'in-progress' ? 'In Progress' : task.status}
              </span>
            </div>
            
            <p className="text-stone-600 text-sm mb-4 line-clamp-2">{task.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(task.preferredDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{task.location}</span>
              </div>
              {task.budget && (
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${task.budget}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Task details based on user role */}
        {isHelper ? (
          <div className="space-y-3">
            {poster && (
              <div className="flex items-center space-x-3 p-3 bg-stone-50 rounded-lg">
                <img
                  src={poster.avatar || `https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop`}
                  alt={poster.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-stone-900">{poster.name}</div>
                  <div className="text-sm text-stone-600">Task Poster</div>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              {task.status === 'open' && !task.applications.some(app => app.helperId === user.id) && (
                <button className="flex-1 py-2 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                  Apply for Task
                </button>
              )}
              {task.applications.some(app => app.helperId === user.id) && (
                <button className="flex-1 py-2 px-4 bg-blue-100 text-blue-700 font-medium rounded-lg cursor-not-allowed">
                  Application Sent
                </button>
              )}
              <button
                onClick={() => setSelectedTask(task)}
                className="px-4 py-2 border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-50 transition-colors flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {helper && (
              <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                <img
                  src={helper.avatar || `https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop`}
                  alt={helper.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-medium text-stone-900">{helper.name}</div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-stone-600">{helper.rating} • {helper.completedJobs} jobs</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-600">${helper.hourlyRate}/hr</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-stone-500">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{task.applications.length} applications</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Posted {formatDate(task.createdAt)}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTask(task)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-50 transition-colors flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>
                {task.applications.length > 0 && (
                  <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                    Review Applications
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => onPageChange('home')}
          className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            {isHelper ? 'Available Tasks & My Jobs' : 'My Tasks'}
          </h1>
          <p className="text-stone-600">
            {isHelper 
              ? 'Browse available tasks in your area and manage your current jobs.' 
              : 'Manage your posted tasks and track their progress.'
            }
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 mb-6">
          <div className="flex border-b border-stone-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-sm font-medium text-center transition-colors ${
                  activeTab === tab.id
                    ? 'text-emerald-700 border-b-2 border-emerald-600 bg-emerald-50'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-emerald-200 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="space-y-6">
          {getTasksByStatus(activeTab).length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
              <div className="text-stone-400 mb-4">
                {isHelper ? (
                  <UserCheck className="w-16 h-16 mx-auto" />
                ) : (
                  <Users className="w-16 h-16 mx-auto" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                {activeTab === 'active' && 'No Active Tasks'}
                {activeTab === 'completed' && 'No Completed Tasks'}
                {activeTab === 'applications' && 'No Applications Yet'}
              </h3>
              <p className="text-stone-600 mb-6">
                {activeTab === 'active' && isHelper && 'Check back later for new tasks in your area.'}
                {activeTab === 'active' && !isHelper && 'Post your first task to get started.'}
                {activeTab === 'completed' && 'Your completed tasks will appear here.'}
                {activeTab === 'applications' && 'Once helpers apply to your tasks, they\'ll show up here.'}
              </p>
              {activeTab === 'active' && !isHelper && (
                <button
                  onClick={() => onPageChange('post-task')}
                  className="py-3 px-6 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Post Your First Task
                </button>
              )}
            </div>
          ) : (
            getTasksByStatus(activeTab).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>

        {/* Task Detail Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6 border-b border-stone-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-stone-900">{selectedTask.title}</h2>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="text-stone-400 hover:text-stone-600 p-2"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-stone-900 mb-2">Description</h3>
                  <p className="text-stone-600">{selectedTask.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-stone-900 mb-1">Date & Time</h4>
                    <p className="text-stone-600 text-sm">{formatDate(selectedTask.preferredDate)} • {selectedTask.preferredTime}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 mb-1">Location</h4>
                    <p className="text-stone-600 text-sm">{selectedTask.location}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 mb-1">Category</h4>
                    <p className="text-stone-600 text-sm">{selectedTask.category}</p>
                  </div>
                  {selectedTask.budget && (
                    <div>
                      <h4 className="font-medium text-stone-900 mb-1">Budget</h4>
                      <p className="text-stone-600 text-sm">${selectedTask.budget}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="flex-1 py-3 px-4 border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    Close
                  </button>
                  <button className="flex-1 py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobsPage;