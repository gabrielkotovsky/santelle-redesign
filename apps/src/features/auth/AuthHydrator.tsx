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
            
            // Only refresh if session expires within 5 minutes
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
        } catch (error) {
          // Even if session refresh failed, try to continue with other steps
          try {
            await refreshSession();
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

