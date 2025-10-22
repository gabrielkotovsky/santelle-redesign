// src/features/auth/AuthHydrator.tsx
import { supabase } from "@/src/services/supabase";
import { useEffect } from "react";
import { AppState } from "react-native";
import { useAuthStore } from "./auth.store";

/**
 * AuthHydrator component that manages auth session refresh when app comes back from background.
 * This ensures the session is still valid and refreshes it if needed.
 */
export function AuthHydrator() {
  const refreshSession = useAuthStore(s => s.refreshSession);
  const reinitializeListener = useAuthStore(s => s.reinitializeListener);

  // Reconnect Realtime and re-subscribe channels
  const reconnectRealtime = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      
      if (token) {
        // Set the new auth token for Realtime
        supabase.realtime.setAuth(token);
        
        // Reconnect the socket
        supabase.realtime.connect();
        
        // Re-subscribe any existing channels
        const channels = supabase.getChannels();
        for (const channel of channels) {
          if (channel.state !== 'joined') {
            channel.subscribe();
          }
        }
      }
    } catch (error) {
      console.warn('Failed to reconnect Realtime:', error);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      if (nextAppState === "active") {
        try {
          // Check current session first
          const { data: currentSession } = await supabase.auth.getSession();
          
          if (currentSession.session && currentSession.session.expires_at) {
            const expiresAt = currentSession.session.expires_at * 1000;
            const now = Date.now();
            const timeUntilExpiry = expiresAt - now;
            
            // Refresh if session is expired OR expires within 5 minutes
            if (timeUntilExpiry <= 5 * 60 * 1000) {
              // Add timeout to prevent hanging
              const refreshPromise = supabase.auth.refreshSession();
              const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Session refresh timeout')), 10000)
              );
              
              await Promise.race([refreshPromise, timeoutPromise]);
            }
          }
          
          // Update our local store with the session
          await refreshSession();
          
          // Recreate the auth state listener in case it was killed by the OS
          await reinitializeListener();
          
          // Reconnect Realtime and re-subscribe channels
          await reconnectRealtime();
        } catch (error) {
          // Even if session refresh failed, try to continue with other steps
          try {
            await refreshSession();
            await reconnectRealtime();
          } catch (fallbackError) {
            // Silently handle fallback errors
          }
        }
      }
    });

    return () => subscription.remove();
  }, [refreshSession, reinitializeListener]);

  return null;
}

