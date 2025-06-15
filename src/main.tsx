import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { supabase } from './lib/supabase'

// Handle Supabase auth state recovery on app load
const initializeAuth = async () => {
  try {
    // Let Supabase handle the auth callback from the URL
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
    }
    
    // If we have a session, Supabase has handled the auth callback
    if (session) {
      console.log('User authenticated:', session.user.email);
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
};

// Initialize auth before rendering
initializeAuth();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
