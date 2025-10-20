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
        // 1. Force a session refresh from Supabase to ensure token is valid
        await supabase.auth.refreshSession();
        
        // 2. Update our local store with the refreshed session
        await refreshSession();
        
        // 3. Recreate the auth state listener in case it was killed by the OS
        await reinitializeListener();
      }
    });

    return () => subscription.remove();
  }, [refreshSession, reinitializeListener]);

  return null;
}

