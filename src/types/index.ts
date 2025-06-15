export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  zipCode: string;
  role: 'poster' | 'helper';
  avatar?: string;
  createdAt: string;
}

export interface Helper extends User {
  skills: string[];
  serviceArea: string[];
  hourlyRate: number;
  rating: number;
  completedJobs: number;
  bio: string;
  availability: string[];
  verified: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  budget?: number;
  preferredDate: string;
  preferredTime: string;
  location: string;
  zipCode: string;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  posterId: string;
  helperId?: string;
  applications: Application[];
  createdAt: string;
  completedAt?: string;
}

export interface Application {
  id: string;
  taskId: string;
  helperId: string;
  message: string;
  bidAmount?: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Review {
  id: string;
  taskId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export const TASK_CATEGORIES = [
  'AC Check & Maintenance',
  'Dishwasher Installation',
  'Air Filter Replacement',
  'General Troubleshooting',
  'Light Fixture Installation',
  'Plumbing Repair',
  'Furniture Assembly',
  'TV Mounting',
  'Electrical Work',
  'Home Organization',
  'Other'
] as const;

export type TaskCategory = typeof TASK_CATEGORIES[number];