// src/features/test-session/SessionHydrator.tsx
import { useEffect } from "react";
import { AppState } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useTestSession } from "@/src/features/test-session/testSession.store";
import { supabase } from "@/src/services/supabase";

export default function SessionHydrator() {
  const hydrateFromServer = useTestSession(s => s.hydrateFromServer);

  // 1) After auth is present, hydrate once
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data.session?.user) {
        await hydrateFromServer();
      }
    })();
    return () => { mounted = false; };
  }, [hydrateFromServer]);

  // 2) When app comes to foreground, re-check
  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") hydrateFromServer();
    });
    return () => sub.remove();
  }, [hydrateFromServer]);

  // 3) When screen regains focus (works in nested stacks too)
  useFocusEffect(useCallback(() => {
    hydrateFromServer();
  }, [hydrateFromServer]));

  return null;
}