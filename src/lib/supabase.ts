import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client only if credentials are provided
export const supabase = supabaseUrl && supabaseKey ? 
  createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',  // More secure and faster auth flow
      storage: window.localStorage,  // Explicitly use localStorage for better performance
      async onAuthStateChange(event, session) {
        // Log auth state changes for debugging
        console.debug('Auth state changed:', event, session?.user?.email);
      }
    },
    db: {
      schema: 'public'
    }
  }) : 
  null;

// Add a helper function to check connection
export const checkSupabaseConnection = async () => {
  if (!supabase) {
    console.error('Supabase client not initialized - missing credentials');
    return false;
  }

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
