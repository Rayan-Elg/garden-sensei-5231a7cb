
import { createClient } from '@supabase/supabase-js';

// Log environment variable status for debugging
console.log('VITE_SUPABASE_URL present:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Ensure the environment variables are loaded
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rvrhlbsqhgbtecjjdtik.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2cmhsYnNxaGdidGVjampkdGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNDE2NDgsImV4cCI6MjA1NDYxNzY0OH0.sit78M1xKFlgURqiOqLkl_5ieXphRog6Vqx0nTpAS90';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: localStorage
  }
});

export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    console.log('Supabase connection successful');
    return true;
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return false;
  }
};
