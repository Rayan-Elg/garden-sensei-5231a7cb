import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client only if credentials are provided
export const supabase = supabaseUrl && supabaseKey ? 
  createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Disable URL detection since we're not using OAuth
      flowType: 'pkce',  // More secure and faster auth flow
      storage: window.localStorage,  // Explicitly use localStorage for better performance
      debug: false // Disable debug logs
    },
    global: {
      // Custom error handler to prevent default error behavior
      headers: {
        'x-client-info': 'garden-sensei'
      }
    },
    db: {
      schema: 'public'
    }
  }) : 
  null;

// Add a helper function to check connection
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
