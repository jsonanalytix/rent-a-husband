# Rent-a-Husband Backend Infrastructure Setup

## Overview

The backend infrastructure for Rent-a-Husband has been successfully implemented using Supabase. This document provides details about the implementation and how to use it.

## Infrastructure Details

### Supabase Project
- **Project Name**: rent-a-husband
- **Project URL**: https://gzkziuaunzqzzypiyovl.supabase.co
- **Region**: us-east-2

### Database Schema

The following tables have been created:

1. **users** - Custom user table extending auth.users
   - Fields: id, email, phone, role (poster/helper/admin), status, timestamps
   - RLS enabled with appropriate policies

2. **profiles** - User profile information
   - Fields: user_id, name, avatar_url, bio, zip_code, address, emergency_contact, rating, review_count
   - Public read access, users can update their own profiles

3. **helper_profiles** - Additional information for helpers
   - Fields: user_id, skills, service_areas, hourly_rate, availability, background_check_status, insurance_verified, license_info
   - Public read access for discovery

4. **tasks** - Task postings
   - Fields: id, poster_id, title, description, category, budget, budget_type, status, location, preferred_date/time, helper_id
   - Complex RLS policies for different user roles and task states

5. **applications** - Helper applications to tasks
   - Fields: id, task_id, helper_id, bid_amount, message, status
   - Helpers can apply, posters can view/update applications for their tasks

6. **messages** - Real-time messaging
   - Fields: id, conversation_id, sender_id, recipient_id, task_id, content, attachments, read_at
   - Private between participants

7. **reviews** - Two-way review system
   - Fields: id, task_id, reviewer_id, reviewee_id, rating, comment
   - Public read access

8. **payments** - Payment tracking
   - Fields: id, task_id, payer_id, payee_id, amount, platform_fee, status, stripe_payment_id
   - Private to involved parties

9. **notifications** - In-app notifications
   - Fields: id, user_id, type, title, message, data, read_at
   - Private to recipient

10. Supporting tables: task_categories, service_areas, platform_settings, reports, saved_searches, user_favorites

### Security Features

1. **Row Level Security (RLS)** enabled on all tables
2. **Secure functions** with proper search_path settings
3. **Authentication triggers** for automatic profile creation
4. **Data validation** through check constraints
5. **Referential integrity** with foreign keys

### Edge Functions (Serverless APIs)

Three Edge Functions have been deployed:

1. **auth-handler** - Authentication and user management
   - `/auth/register` - User registration
   - `/auth/profile` - Get user profile
   - `/auth/update-role` - Update user role

2. **tasks-api** - Task management
   - `POST /tasks` - Create a new task
   - `GET /tasks/:id` - Get task details
   - `POST /tasks/search` - Search tasks with filters
   - `POST /tasks/:id/apply` - Apply to a task
   - `POST /tasks/:id/complete` - Mark task as completed

3. **messaging-api** - Messaging system
   - `POST /messages/send` - Send a message
   - `GET /messages/conversations` - Get user's conversations
   - `GET /messages/conversation/:id` - Get messages in a conversation
   - `POST /messages/mark-read` - Mark messages as read

### Database Functions

Custom PostgreSQL functions created:

1. **handle_new_user()** - Automatically creates user profile on registration
2. **handle_updated_at()** - Updates timestamp on record changes
3. **handle_application_accepted()** - Updates task status when application is accepted
4. **handle_payment_completed()** - Marks task as completed when payment is processed
5. **calculate_platform_fee()** - Calculates 15% platform fee
6. **generate_conversation_id()** - Creates consistent conversation IDs
7. **update_user_rating()** - Updates user rating when review is posted
8. **create_notification()** - Creates notifications
9. **search_tasks()** - Advanced task search with filters

### Views for Analytics

1. **conversation_summaries** - Aggregated conversation data
2. **task_analytics** - Daily task statistics
3. **user_stats** - User performance metrics

## Frontend Integration

### 1. Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### 2. Import the Client
```typescript
import { supabase } from './lib/supabase';
```

### 3. Authentication Example
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      name: 'John Doe',
      role: 'poster' // or 'helper'
    }
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### 4. Database Operations Example
```typescript
// Get tasks
const { data: tasks, error } = await supabase
  .from('tasks')
  .select('*, poster:profiles!tasks_poster_id_fkey(name, avatar_url)')
  .eq('status', 'open')
  .order('created_at', { ascending: false });

// Create a task
const { data, error } = await supabase
  .from('tasks')
  .insert({
    title: 'Fix leaky faucet',
    description: 'Kitchen faucet is dripping',
    category: 'plumbing',
    budget: 100,
    budget_type: 'fixed',
    location: { zip_code: '10001', city: 'New York', state: 'NY' }
  })
  .select()
  .single();
```

### 5. Real-time Subscriptions
```typescript
// Subscribe to new messages
const channel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `recipient_id=eq.${user.id}`
    },
    (payload) => {
      console.log('New message:', payload.new);
    }
  )
  .subscribe();

// Don't forget to unsubscribe
channel.unsubscribe();
```

### 6. Edge Function Calls
```typescript
import { EDGE_FUNCTIONS, getAuthHeaders } from './lib/supabase';

// Search tasks
const response = await fetch(`${EDGE_FUNCTIONS.tasks}/search`, {
  method: 'POST',
  headers: await getAuthHeaders(),
  body: JSON.stringify({
    p_search_term: 'plumbing',
    p_zip_code: '10001',
    p_limit: 20
  })
});
const tasks = await response.json();
```

## TypeScript Support

TypeScript types have been generated and saved to `src/types/supabase.ts`. Import and use them:

```typescript
import type { Database } from './types/supabase';

type Task = Database['public']['Tables']['tasks']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
```

## Next Steps

1. **Payment Integration**: Integrate Stripe Connect for payment processing
2. **Email/SMS**: Configure email templates in Supabase dashboard
3. **Storage**: Set up Supabase Storage for file uploads (profile pictures, task photos)
4. **Background Jobs**: Implement pg_cron for scheduled tasks (auto-cancel old tasks, payment reminders)
5. **Search Enhancement**: Consider adding PostGIS for location-based search
6. **Monitoring**: Set up error tracking and analytics

## Security Considerations

1. **API Keys**: The anon key is safe for client-side use. Never expose the service_role key.
2. **RLS Policies**: All database access is protected by Row Level Security
3. **Input Validation**: Add client-side validation before sending to backend
4. **Rate Limiting**: Consider implementing rate limiting for API endpoints
5. **CORS**: Update CORS settings in Edge Functions for production

## Environment Variables

For local development, create a `.env` file:

```env
VITE_SUPABASE_URL=https://gzkziuaunzqzzypiyovl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

For production, set these environment variables in your deployment platform. 