import React, { useState } from 'react';
import { MessageCircle, Send, ArrowLeft, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockUsers, mockHelpers } from '../../data/mockData';

interface MessagesPageProps {
  onPageChange: (page: string) => void;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  taskTitle?: string;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

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

  // Mock conversations
  const conversations: Conversation[] = [
    {
      id: '1',
      participantId: '1',
      participantName: 'Mike Rodriguez',
      participantAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      lastMessage: 'I can start the AC maintenance tomorrow morning. What time works best for you?',
      lastMessageTime: '10:30 AM',
      unreadCount: 2,
      taskTitle: 'AC System Check Before Summer'
    },
    {
      id: '2',
      participantId: '3',
      participantName: 'David Chen',
      participantAvatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      lastMessage: 'The dishwasher installation is complete! Everything is working perfectly.',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      taskTitle: 'Dishwasher Installation'
    },
    {
      id: '3',
      participantId: '2',
      participantName: 'Sarah Johnson',
      participantAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      lastMessage: 'Thanks for the great review! I really enjoyed helping with your home organization.',
      lastMessageTime: '2 days ago',
      unreadCount: 0,
      taskTitle: 'Home Organization'
    }
  ];

  // Mock messages for selected conversation
  const mockMessages = [
    {
      id: '1',
      senderId: user.id,
      content: 'Hi! I saw your application for the AC maintenance task. When would you be available?',
      timestamp: '9:15 AM',
      isOwn: true
    },
    {
      id: '2',
      senderId: '1',
      content: 'Hello! I\'m available tomorrow morning or afternoon. I have all the necessary tools and can complete a full system check.',
      timestamp: '9:45 AM',
      isOwn: false
    },
    {
      id: '3',
      senderId: user.id,
      content: 'That sounds perfect! Morning would work better for me. Around 10 AM?',
      timestamp: '10:00 AM',
      isOwn: true
    },
    {
      id: '4',
      senderId: '1',
      content: 'I can start the AC maintenance tomorrow morning. What time works best for you?',
      timestamp: '10:30 AM',
      isOwn: false
    }
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // In a real app, send message to backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-stone-200 p-4">
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="flex h-screen lg:h-[calc(100vh-4rem)]">
          {/* Conversations List */}
          <div className={`w-full lg:w-1/3 bg-white border-r border-stone-200 ${selectedConversation ? 'hidden lg:block' : 'block'}`}>
            <div className="p-6 border-b border-stone-200">
              <div className="hidden lg:block mb-4">
                <button
                  onClick={() => onPageChange('home')}
                  className="flex items-center space-x-2 text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
              </div>
              <h1 className="text-2xl font-bold text-stone-900">Messages</h1>
              <p className="text-stone-600 mt-1">Chat with helpers and task posters</p>
            </div>

            <div className="overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">No Messages Yet</h3>
                  <p className="text-stone-600">Start a conversation by applying to tasks or posting your own.</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-200">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`w-full p-4 text-left hover:bg-stone-50 transition-colors ${
                        selectedConversation === conversation.id ? 'bg-emerald-50 border-r-2 border-emerald-600' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={conversation.participantAvatar}
                          alt={conversation.participantName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-stone-900 truncate">
                              {conversation.participantName}
                            </h3>
                            <span className="text-xs text-stone-500">
                              {conversation.lastMessageTime}
                            </span>
                          </div>
                          {conversation.taskTitle && (
                            <p className="text-xs text-emerald-600 mb-1 truncate">
                              Re: {conversation.taskTitle}
                            </p>
                          )}
                          <p className="text-sm text-stone-600 truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${selectedConversation ? 'block' : 'hidden lg:flex'}`}>
            {selectedConversation && selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-stone-200 p-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden text-stone-600 hover:text-stone-900 p-1"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <img
                      src={selectedConv.participantAvatar}
                      alt={selectedConv.participantName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="font-semibold text-stone-900">{selectedConv.participantName}</h2>
                      {selectedConv.taskTitle && (
                        <p className="text-sm text-emerald-600">Re: {selectedConv.taskTitle}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
                  {mockMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.isOwn
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-stone-900 border border-stone-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isOwn ? 'text-emerald-100' : 'text-stone-500'}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-stone-200 p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-stone-50">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">Select a Conversation</h3>
                  <p className="text-stone-600">Choose a conversation from the list to start chatting.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;