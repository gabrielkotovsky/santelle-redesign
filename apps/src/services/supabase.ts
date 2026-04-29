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
      flowType: 'pkce',
      storage: AsyncStorage,
      // Reduce token refresh threshold to refresh earlier
      // This prevents the token from getting too close to expiration
      storageKey: 'santelle-auth-token',
    },
    // Add global configuration for better session handling
    global: {
      headers: {
        'X-Client-Info': 'santelle-app',
      },
    },
    realtime: {
      // Configure Realtime with better reconnection settings
      params: {
        eventsPerSecond: 10,
      },
      // Increase heartbeat interval to prevent aggressive disconnects
      heartbeatIntervalMs: 30000, // 30 seconds
      // Increase timeout before considering connection lost
      timeout: 20000, // 20 seconds
    },
  });

// Keep Realtime's auth token in sync with Auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
  // Important: keep RT using the latest access token
  const token = session?.access_token ?? null;
  
  if (event === 'TOKEN_REFRESHED') {
    console.log('🔄 Token refreshed', {
      timestamp: new Date().toISOString(),
      expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
    });
  }
  
  if (event === 'SIGNED_OUT') {
    // Explicitly disconnect realtime when signing out
    supabase.realtime.disconnect();
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    // Update token and ensure connection
    supabase.realtime.setAuth(token ?? undefined);
    
    // If disconnected, reconnect
    const realtimeState = supabase.realtime.channels.length > 0 
      ? supabase.realtime.channels[0]?.state 
      : undefined;
    
    if (realtimeState === 'closed' || realtimeState === 'errored') {
      supabase.realtime.connect();
    }
  } else {
    supabase.realtime.setAuth(token ?? undefined);
  }
});