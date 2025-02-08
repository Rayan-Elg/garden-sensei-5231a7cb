import { createClient } from '@supabase/supabase-js';

// These environment variables should be set in your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Add debug logging for environment variables
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

// Create Supabase client only if credentials are provided
export const supabase = supabaseUrl && supabaseKey ? 
  createClient(supabaseUrl, supabaseKey) : 
  null;

// Add a helper function to check connection
export const checkSupabaseConnection = async () => {
  if (!supabase) {
    console.error('Supabase client not initialized - missing credentials', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    });
    return false;
  }

  try {
    const { data, error } = await supabase.from('plants').select('id').limit(1);
    if (error) {
      console.error('Supabase connection error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return false;
    }
    console.log('Supabase connection successful, found', data?.length || 0, 'plants');
    return true;
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return false;
  }
};
