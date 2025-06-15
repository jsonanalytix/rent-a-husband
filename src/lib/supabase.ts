import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://gzkziuaunzqzzypiyovl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6a3ppdWF1bnpxenp5cGl5b3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NTgzOTcsImV4cCI6MjA2NTUzNDM5N30.IFxdlWH9cmogeY2ql71aYKkAgE67y0SByxdRe8mw4t0';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Edge Function URLs
export const EDGE_FUNCTIONS = {
  auth: `${supabaseUrl}/functions/v1/auth-handler`,
  tasks: `${supabaseUrl}/functions/v1/tasks-api`,
  messaging: `${supabaseUrl}/functions/v1/messaging-api`,
};

// Helper function to get auth headers
export const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  };
};

// Test function to check if user can insert into tables
export const testDatabaseAccess = async (userId: string) => {
  console.log('Testing database access for user:', userId);
  
  // Test users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  console.log('Users table select:', { userData, userError });
  
  // Test profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  console.log('Profiles table select:', { profileData, profileError });
  
  return { userData, profileData };
}; 