import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Validate environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('EXPO_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  
  throw new Error(
    `❌ Supabase initialization failed!\n\n` +
    `Missing required environment variables: ${missing.join(', ')}\n\n` +
    `For native builds, ensure these are:\n` +
    `1. Set in EAS Secrets (eas secret:create)\n` +
    `2. OR defined in eas.json for each build profile\n` +
    `3. Prefixed with EXPO_PUBLIC_ to be available at runtime`
  );
}

export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey, 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      // Refresh token more aggressively
      refreshTokenRetryAttempts: 3,
      refreshTokenRetryInterval: 2000,
      storage: {
        getItem: (key) => AsyncStorage.getItem(key),
        setItem: (key, value) => AsyncStorage.setItem(key, value),
        removeItem: (key) => AsyncStorage.removeItem(key),
      },
    },
    // Add global configuration for better session handling
    global: {
      headers: {
        'X-Client-Info': 'santelle-app',
      },
    },
  });

// Keep Realtime's auth token in sync with Auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
    supabase.realtime.setAuth(session?.access_token ?? '');
  }
  if (event === 'SIGNED_OUT') {
    supabase.realtime.disconnect();
  }
});