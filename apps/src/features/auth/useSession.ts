// src/features/auth/useSession.ts
import { useEffect } from "react";
import { useAuthStore } from "./auth.store";

export function useSession() {
  const { session, loading, initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth store if not already initialized
    initialize();
  }, [initialize]);

  return { session, loading };
}