// src/features/auth/AuthHydrator.tsx
import { supabase } from "@/src/services/supabase";
import { sessionRecoveryService } from "@/src/services/sessionRecovery";
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAuthStore } from "./auth.store";

/**
 * AuthHydrator component that manages auth session refresh when app comes back from background.
 * This ensures the session is still valid and refreshes it if needed.
 */
export function AuthHydrator() {
  const refreshSession = useAuthStore(s => s.refreshSession);
  const reinitializeListener = useAuthStore(s => s.reinitializeListener);
  const sessionCheckInterval = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const maxReconnectAttempts = 5;
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Proactive session monitoring with React Native Timer
  const startSessionMonitoring = () => {
    // Clear any existing interval
    if (sessionCheckInterval.current) {
      clearTimeout(sessionCheckInterval.current);
    }
    
    const checkSession = async () => {
      try {
        const { data: currentSession } = await supabase.auth.getSession();
        
        if (currentSession.session && currentSession.session.expires_at) {
          const expiresAt = currentSession.session.expires_at * 1000;
          const now = Date.now();
          const timeUntilExpiry = expiresAt - now;
          
          // Refresh if session expires within 15 minutes (more proactive)
          if (timeUntilExpiry <= 15 * 60 * 1000) {
            console.log('🔄 Refreshing token (monitoring check)', {
              timeUntilExpiry: `${Math.round(timeUntilExpiry / 1000 / 60)} minutes`,
            });
            const { error } = await supabase.auth.refreshSession();
            if (!error) {
              await refreshSession();
            }
          }
        }
      } catch (error) {
        // Silently handle session monitoring error
      } finally {
        // Schedule next check if still in foreground
        if (appStateRef.current === 'active') {
          sessionCheckInterval.current = setTimeout(checkSession, 5 * 60 * 1000); // Check every 5 minutes
        }
      }
    };
    
    // Start first check
    checkSession();
  };

  const stopSessionMonitoring = () => {
    if (sessionCheckInterval.current) {
      clearTimeout(sessionCheckInterval.current);
      sessionCheckInterval.current = null;
    }
  };

  // Enhanced Realtime reconnection with exponential backoff
  const reconnectRealtime = async (attempt: number = 0): Promise<boolean> => {
    try {
      // Check network connectivity first
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        return false;
      }

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      
      if (!token) {
        return false;
      }

      // Explicitly disconnect first to clean up stale connections
      supabase.realtime.disconnect();
      
      // Wait a bit before reconnecting (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Set the new auth token for Realtime
      supabase.realtime.setAuth(token);
      
      // Reconnect the socket
      supabase.realtime.connect();
      
      // Re-subscribe any existing channels
      const channels = supabase.getChannels();
      
      for (const channel of channels) {
        if (channel.state !== 'joined') {
          await channel.subscribe();
        }
      }
      
      reconnectAttempts.current = 0; // Reset attempts on success
      return true;
    } catch (error) {
      // Retry with exponential backoff
      if (attempt < maxReconnectAttempts) {
        return reconnectRealtime(attempt + 1);
      }
      
      return false;
    }
  };

  // Comprehensive session refresh with better error handling
  const handleSessionRefresh = async () => {
    try {
      const { data: currentSession, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        return false;
      }
      
      if (currentSession.session && currentSession.session.expires_at) {
        const expiresAt = currentSession.session.expires_at * 1000;
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;
        
        // Refresh if session is expired OR expires within 5 minutes
        if (timeUntilExpiry <= 5 * 60 * 1000) {
          console.log('🔄 Refreshing token (app state change)', {
            timeUntilExpiry: `${Math.round(timeUntilExpiry / 1000 / 60)} minutes`,
          });
          // Increased timeout to 30 seconds for slower connections
          const refreshPromise = supabase.auth.refreshSession();
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Session refresh timeout')), 30000)
          );
          
          const { data, error } = await Promise.race([
            refreshPromise,
            timeoutPromise
          ]) as any;
          
          if (error) {
            return false;
          }
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    // Network state listener
    const unsubscribeNetInfo = NetInfo.addEventListener(async (state) => {
      if (state.isConnected && appStateRef.current === 'active') {
        await handleSessionRefresh();
        await refreshSession();
        await reconnectRealtime();
      }
    });

    // App state listener
    const subscription = AppState.addEventListener("change", async (nextAppState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextAppState;

      if (nextAppState === "active" && previousState !== "active") {
        try {
          // 1. Check and refresh session if needed
          await handleSessionRefresh();
          
          // 2. Update our local store with the session
          await refreshSession();
          
          // 3. Recreate the auth state listener in case it was killed by the OS
          await reinitializeListener();
          
          // 4. Reconnect Realtime with retry logic
          await reconnectRealtime();
          
          // 5. Start proactive session monitoring when app becomes active
          startSessionMonitoring();
          
          // 6. Start session recovery service
          await sessionRecoveryService.startMonitoring();
          
        } catch (error) {
          // Fallback: try essential steps without throwing
          try {
            await refreshSession();
            await reconnectRealtime();
            startSessionMonitoring();
            await sessionRecoveryService.startMonitoring();
          } catch (fallbackError) {
            // Silently handle fallback error
          }
        }
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        
        // Stop session monitoring when app goes to background to save battery
        stopSessionMonitoring();
        sessionRecoveryService.stopMonitoring();
        
        // Optionally disconnect Realtime to save resources
        // Uncomment if you want to fully disconnect when backgrounded
        // supabase.realtime.disconnect();
      }
    });

    // Start monitoring immediately if app is active
    if (AppState.currentState === 'active') {
      startSessionMonitoring();
      sessionRecoveryService.startMonitoring();
    }

    return () => {
      subscription.remove();
      unsubscribeNetInfo();
      stopSessionMonitoring();
      sessionRecoveryService.stopMonitoring();
    };
  }, [refreshSession, reinitializeListener]);

  return null;
}

