// src/features/auth/AuthHydrator.tsx
import { supabase } from "@/src/services/supabase";
import { sessionRecoveryService } from "@/src/services/sessionRecovery";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useAuthStore } from "./auth.store";

/**
 * AuthHydrator component that manages auth session refresh when app comes back from background.
 * This ensures the session is still valid and refreshes it if needed.
 */
export function AuthHydrator() {
  const refreshSession = useAuthStore(s => s.refreshSession);
  const reinitializeListener = useAuthStore(s => s.reinitializeListener);
  const sessionCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Proactive session monitoring
  const startSessionMonitoring = () => {
    // Clear any existing interval
    if (sessionCheckInterval.current) {
      clearInterval(sessionCheckInterval.current);
    }
    
    // Check session every 10 minutes when app is active
    sessionCheckInterval.current = setInterval(async () => {
      try {
        const { data: currentSession } = await supabase.auth.getSession();
        
        if (currentSession.session && currentSession.session.expires_at) {
          const expiresAt = currentSession.session.expires_at * 1000;
          const now = Date.now();
          const timeUntilExpiry = expiresAt - now;
          
          // Refresh if session expires within 15 minutes (more proactive)
          if (timeUntilExpiry <= 15 * 60 * 1000) {
            console.log('Proactively refreshing session - expires in', Math.round(timeUntilExpiry / 60000), 'minutes');
            await supabase.auth.refreshSession();
            await refreshSession();
          }
        }
      } catch (error) {
        console.warn('Session monitoring error:', error);
      }
    }, 10 * 60 * 1000); // Check every 10 minutes
  };

  const stopSessionMonitoring = () => {
    if (sessionCheckInterval.current) {
      clearInterval(sessionCheckInterval.current);
      sessionCheckInterval.current = null;
    }
  };

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
              console.log('Session expires soon, refreshing immediately');
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
          
          // Start proactive session monitoring when app becomes active
          startSessionMonitoring();
          
          // Start session recovery service
          await sessionRecoveryService.startMonitoring();
        } catch (error) {
          console.warn('App state change error:', error);
          // Even if session refresh failed, try to continue with other steps
          try {
            await refreshSession();
            await reconnectRealtime();
            startSessionMonitoring();
            await sessionRecoveryService.startMonitoring();
          } catch (fallbackError) {
            // Silently handle fallback errors
          }
        }
      } else if (nextAppState === "background") {
        // Stop session monitoring when app goes to background to save battery
        stopSessionMonitoring();
        sessionRecoveryService.stopMonitoring();
      }
    });

    return () => {
      subscription.remove();
      stopSessionMonitoring();
      sessionRecoveryService.stopMonitoring();
    };
  }, [refreshSession, reinitializeListener]);

  return null;
}

