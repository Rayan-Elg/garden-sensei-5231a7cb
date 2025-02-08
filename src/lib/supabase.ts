
import { createClient } from '@supabase/supabase-js';

// These environment variables should be set in your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client only if credentials are provided
export const supabase = supabaseUrl && supabaseKey ? 
  createClient(supabaseUrl, supabaseKey) : 
  null;

// Add a helper function to check connection
export const checkSupabaseConnection = async () => {
  if (!supabase) {
    console.error('Supabase client not initialized - missing credentials');
    return false;
  }

  try {
    const { error } = await supabase.from('plants').select('id').limit(1);
    if (error) {
      console.error('Supabase connection error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return false;
  }
};
