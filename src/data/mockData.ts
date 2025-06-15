import { Helper, Task, Application, Review, User } from '../types';

export const mockHelpers: Helper[] = [
  {
    id: '1',
    name: 'Mike Rodriguez',
    email: 'mike@example.com',
    phone: '(555) 123-4567',
    zipCode: '90210',
    role: 'helper',
    skills: ['AC Check & Maintenance', 'Electrical Work', 'Plumbing Repair'],
    serviceArea: ['90210', '90211', '90212'],
    hourlyRate: 45,
    rating: 4.9,
    completedJobs: 127,
    bio: 'Licensed electrician with 8+ years experience. I specialize in home maintenance and quick fixes. Available weekends and evenings.',
    availability: ['weekends', 'evenings'],
    verified: true,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '(555) 987-6543',
    zipCode: '90210',
    role: 'helper',
    skills: ['Furniture Assembly', 'Home Organization', 'Light Fixture Installation'],
    serviceArea: ['90210', '90213', '90214'],
    hourlyRate: 35,
    rating: 4.8,
    completedJobs: 89,
    bio: 'Interior designer turned handywoman. I love helping people organize their spaces and make their homes more functional.',
    availability: ['weekdays', 'mornings'],
    verified: true,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    createdAt: '2024-02-01T14:20:00Z'
  },
  {
    id: '3',
    name: 'David Chen',
    email: 'david@example.com',
    phone: '(555) 456-7890',
    zipCode: '90211',
    role: 'helper',
    skills: ['Dishwasher Installation', 'TV Mounting', 'General Troubleshooting'],
    serviceArea: ['90210', '90211', '90212', '90213'],
    hourlyRate: 40,
    rating: 4.7,
    completedJobs: 156,
    bio: 'Former appliance repair technician. Quick, reliable, and always clean up after myself. Same-day service available.',
    availability: ['flexible'],
    verified: true,
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    createdAt: '2024-01-20T09:15:00Z'
  },
  {
    id: '4',
    name: 'Jennifer Martinez',
    email: 'jen@example.com',
    phone: '(555) 234-5678',
    zipCode: '90212',
    role: 'helper',
    skills: ['Air Filter Replacement', 'AC Check & Maintenance', 'Home Organization'],
    serviceArea: ['90212', '90213', '90214'],
    hourlyRate: 30,
    rating: 4.9,
    completedJobs: 78,
    bio: 'HVAC certified with a focus on preventive maintenance. I help keep your home comfortable year-round.',
    availability: ['weekdays'],
    verified: false,
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    createdAt: '2024-02-10T16:45:00Z'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Replace HVAC Air Filter',
    description: 'Need someone to replace the air filter in my HVAC system. I have the new filter, just need help accessing and replacing it safely.',
    category: 'Air Filter Replacement',
    budget: 50,
    preferredDate: '2024-03-20',
    preferredTime: 'morning',
    location: 'Beverly Hills, CA',
    zipCode: '90210',
    status: 'open',
    posterId: 'poster1',
    applications: [],
    createdAt: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Dishwasher Installation',
    description: 'Just bought a new dishwasher and need help installing it. All connections are already in place, just need to connect and test.',
    category: 'Dishwasher Installation',
    budget: 120,
    preferredDate: '2024-03-22',
    preferredTime: 'afternoon',
    location: 'West Hollywood, CA',
    zipCode: '90211',
    status: 'in-progress',
    posterId: 'poster2',
    helperId: '3',
    applications: [
      {
        id: 'app1',
        taskId: '2',
        helperId: '3',
        message: 'I have extensive experience with dishwasher installations. Can complete this today if needed.',
        bidAmount: 100,
        status: 'accepted',
        createdAt: '2024-03-16T14:20:00Z'
      }
    ],
    createdAt: '2024-03-16T09:15:00Z'
  },
  {
    id: '3',
    title: 'AC System Check Before Summer',
    description: 'Want to make sure my AC is ready for summer. Need someone to check refrigerant levels, clean filters, and test the system.',
    category: 'AC Check & Maintenance',
    budget: 80,
    preferredDate: '2024-03-25',
    preferredTime: 'evening',
    location: 'Beverly Hills, CA',
    zipCode: '90212',
    status: 'open',
    posterId: 'poster3',
    applications: [
      {
        id: 'app2',
        taskId: '3',
        helperId: '1',
        message: 'Licensed HVAC tech here. I can perform a complete system check and provide a detailed report.',
        bidAmount: 75,
        status: 'pending',
        createdAt: '2024-03-17T11:30:00Z'
      },
      {
        id: 'app3',
        taskId: '3',
        helperId: '4',
        message: 'HVAC certified with preventive maintenance expertise. Available this weekend.',
        bidAmount: 70,
        status: 'pending',
        createdAt: '2024-03-17T15:45:00Z'
      }
    ],
    createdAt: '2024-03-17T08:00:00Z'
  },
  {
    id: '4',
    title: 'TV Wall Mount Installation',
    description: 'Need help mounting a 55" TV on the living room wall. I have the mount hardware, just need someone with the right tools and experience.',
    category: 'TV Mounting',
    preferredDate: '2024-03-21',
    preferredTime: 'weekend',
    location: 'Santa Monica, CA',
    zipCode: '90213',
    status: 'completed',
    posterId: 'poster4',
    helperId: '3',
    applications: [],
    createdAt: '2024-03-10T12:00:00Z',
    completedAt: '2024-03-12T16:30:00Z'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    taskId: '4',
    reviewerId: 'poster4',
    revieweeId: '3',
    rating: 5,
    comment: 'David was fantastic! Professional, punctual, and did a perfect job mounting our TV. Highly recommend!',
    createdAt: '2024-03-12T18:00:00Z'
  },
  {
    id: '2',
    taskId: 'task_old_1',
    reviewerId: 'poster5',
    revieweeId: '1',
    rating: 5,
    comment: 'Mike fixed our electrical issue quickly and explained everything clearly. Will definitely hire again.',
    createdAt: '2024-03-05T14:30:00Z'
  },
  {
    id: '3',
    taskId: 'task_old_2',
    reviewerId: 'poster6',
    revieweeId: '2',
    rating: 4,
    comment: 'Sarah did a great job organizing our closet. Very creative solutions and attention to detail.',
    createdAt: '2024-02-28T10:15:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: 'poster1',
    name: 'Emily Watson',
    email: 'emily@example.com',
    phone: '(555) 111-2222',
    zipCode: '90210',
    role: 'poster',
    avatar: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 'poster2',
    name: 'Robert Thompson',
    email: 'robert@example.com',
    phone: '(555) 333-4444',
    zipCode: '90211',
    role: 'poster',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    createdAt: '2024-01-15T14:30:00Z'
  }
];