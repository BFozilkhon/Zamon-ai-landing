import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder-for-dev.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key-for-development-only';

// Explicitly log the environment variables for debugging
console.log('Supabase Configuration:', { 
  hasUrl: !!process.env.REACT_APP_SUPABASE_URL,
  hasKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
  usingPlaceholders: !process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY
});

// Development mode detection - more robust checks
export const isDevMode = (
  // Check for missing environment variables
  !process.env.REACT_APP_SUPABASE_URL || 
  !process.env.REACT_APP_SUPABASE_ANON_KEY ||
  // Check if we're using the placeholder values
  supabaseUrl === 'https://placeholder-for-dev.supabase.co' ||
  supabaseAnonKey === 'placeholder-key-for-development-only' ||
  // Force development mode with a flag
  process.env.NODE_ENV === 'development'
);

console.log(`Application running in ${isDevMode ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);

if (isDevMode) {
  console.warn('Development mode active: Authentication checks are bypassed');
} else if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials are missing in environment variables, but not in development mode!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 