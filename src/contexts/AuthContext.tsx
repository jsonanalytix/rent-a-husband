import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type HelperProfile = Database['public']['Tables']['helper_profiles']['Row'];
type DbUser = Database['public']['Tables']['users']['Row'];

interface AuthUser {
  id: string;
  email: string;
  role: 'poster' | 'helper' | 'admin';
  profile: Profile | null;
  helperProfile?: HelperProfile | null;
  dbUser: DbUser | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: 'poster' | 'helper') => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  isHelper: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and related data
  const fetchUserData = async (supabaseUser: SupabaseUser) => {
    try {
      // Get user record from users table
      const { data: dbUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle(); // Use maybeSingle instead of single to handle no rows

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user:', userError);
        throw userError;
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .maybeSingle(); // Use maybeSingle instead of single

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      // Get helper profile if user is a helper
      let helperProfile = null;
      if (dbUser?.role === 'helper') {
        const { data, error } = await supabase
          .from('helper_profiles')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .maybeSingle(); // Use maybeSingle instead of single
        
        if (!error || error.code === 'PGRST116') {
          helperProfile = data;
        }
      }

      // If we don't have a user record, set basic info from auth
      if (!dbUser) {
        console.warn('User record not found in database, using auth data');
        const authUser: AuthUser = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          role: 'poster', // Default role
          profile: null,
          helperProfile: null,
          dbUser: null
        };
        setUser(authUser);
        return;
      }

      const authUser: AuthUser = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        role: dbUser.role as 'poster' | 'helper' | 'admin',
        profile,
        helperProfile,
        dbUser
      };

      setUser(authUser);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Set minimal user data even if fetch fails
      const minimalUser: AuthUser = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        role: 'poster',
        profile: null,
        helperProfile: null,
        dbUser: null
      };
      setUser(minimalUser);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await fetchUserData(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserData(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserData(data.user);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to login' };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'poster' | 'helper'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Starting registration for:', email, 'with role:', role);
      
      // Sign up the user with metadata
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (signUpError) {
        console.error('Auth signup error:', signUpError);
        throw signUpError;
      }

      console.log('Auth signup successful, user:', signUpData.user?.id);

      // Check if email confirmation is required
      if (signUpData.user && !signUpData.session) {
        console.log('Email confirmation required');
        return { 
          success: true, 
          error: 'Please check your email to confirm your account before signing in.' 
        };
      }

      // If we have a session, the user is signed in
      if (signUpData.user && signUpData.session) {
        console.log('User signed up and signed in successfully');
        
        // Wait a bit for the database trigger to create records
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try to fetch user data, but don't fail if it's not ready yet
        try {
          await fetchUserData(signUpData.user);
        } catch (error) {
          console.error('Error fetching user data after signup:', error);
          // Set basic user data even if database records aren't ready
          const basicUser: AuthUser = {
            id: signUpData.user.id,
            email: signUpData.user.email!,
            role: role,
            profile: {
              user_id: signUpData.user.id,
              name: name,
              avatar_url: null,
              bio: null,
              zip_code: null,
              address: null,
              emergency_contact: null,
              rating: null,
              review_count: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            helperProfile: null,
            dbUser: null
          };
          setUser(basicUser);
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message || 'Failed to register' };
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh user data
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        await fetchUserData(supabaseUser);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to update profile' };
    }
  };

  const isHelper = user?.role === 'helper';

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register, 
      updateProfile, 
      isHelper 
    }}>
      {children}
    </AuthContext.Provider>
  );
};