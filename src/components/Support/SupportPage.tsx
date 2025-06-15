import React, { useState } from 'react';
import { HelpCircle, MessageCircle, Phone, Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SupportPageProps {
  onPageChange: (page: string) => void;
}

const SupportPage: React.FC<SupportPageProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqCategories = [
    {
      title: 'Getting Started',
      questions: [
        {
          q: 'How do I post my first task?',
          a: 'Click "Post a Task" in the navigation, fill out the task details including title, description, category, and preferred date. Your task will be visible to helpers in your area immediately.'
        },
        {
          q: 'How do I become a helper?',
          a: 'Sign up for a helper account, complete your profile with your skills and hourly rate, then browse available tasks in your area and apply to ones that match your expertise.'
        },
        {
          q: 'Is there a fee to use the platform?',
          a: 'Posting tasks is free for task posters. Helpers pay a small service fee only when they complete a job successfully.'
        }
      ]
    },
    {
      title: 'Safety & Trust',
      questions: [
        {
          q: 'Are helpers background checked?',
          a: 'Yes, all helpers go through a verification process including background checks and skill verification before they can accept tasks.'
        },
        {
          q: 'What if I\'m not satisfied with the work?',
          a: 'We have a satisfaction guarantee. If you\'re not happy with the completed work, contact our support team and we\'ll work to resolve the issue.'
        },
        {
          q: 'How do I report a problem?',
          a: 'You can report issues through the contact form below, via email, or through the in-app messaging system. We respond to all reports within 24 hours.'
        }
      ]
    },
    {
      title: 'Payments',
      questions: [
        {
          q: 'How do payments work?',
          a: 'Payments are processed securely through our platform. Task posters pay after work is completed and approved. Helpers receive payment within 2-3 business days.'
        },
        {
          q: 'Can I get a refund?',
          a: 'Refunds are available if work is not completed as agreed. Contact support with details about your specific situation.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, debit cards, and PayPal for secure payment processing.'
        }
      ]
    }
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      available: 'Available 9 AM - 6 PM PST'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      action: 'Send Email',
      available: 'Response within 24 hours'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak with a support agent',
      action: 'Call Now',
      available: '(555) 123-HELP'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !message.trim()) return;
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Message Sent!</h2>
          <p className="text-stone-600 mb-6">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => onPageChange('home')}
            className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">How Can We Help?</h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{option.title}</h3>
                <p className="text-stone-600 text-sm mb-3">{option.description}</p>
                <p className="text-xs text-stone-500 mb-4">{option.available}</p>
                <button className="w-full py-2 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                  {option.action}
                </button>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-lg font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                    {category.title}
                  </h3>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex} className="border-l-4 border-emerald-200 pl-4">
                        <h4 className="font-medium text-stone-900 mb-2">{faq.q}</h4>
                        <p className="text-stone-600 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-stone-700 mb-2">
                  What can we help you with? *
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select a category</option>
                  <option value="account">Account Issues</option>
                  <option value="payment">Payment Problems</option>
                  <option value="task">Task-related Questions</option>
                  <option value="safety">Safety Concerns</option>
                  <option value="technical">Technical Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {user && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={user.name}
                      disabled
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50 text-stone-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50 text-stone-600"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={!selectedCategory || !message.trim()}
                className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>

            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-emerald-700">
                <strong>💡 Tip:</strong> For faster support, include your task ID or helper name if your question is about a specific job.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;