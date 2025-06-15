import React, { useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const AuthCallback: React.FC = () => {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the current session - Supabase will automatically handle the tokens in the URL
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          // Redirect to login on error
          window.location.href = '/';
          return;
        }

        if (session) {
          console.log('Authentication successful:', session.user.email);
          // Redirect to home page after successful authentication
          // Use a small delay to ensure session is properly set
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
        } else {
          // No session, redirect to home
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        window.location.href = '/';
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-stone-900">Completing sign in...</h2>
        <p className="mt-2 text-stone-600">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default AuthCallback; 