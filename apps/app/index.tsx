// app/index.tsx
import { Redirect } from "expo-router";
import { useSession } from "@/src/features/auth/useSession";
import { getUserNavigationRoute } from "@/src/features/auth/auth.api";
import { useEffect, useState } from "react";

export default function Index() {
  const { session, loading } = useSession();
  const [navigationRoute, setNavigationRoute] = useState<string | null>(null);

  useEffect(() => {
    async function determineRoute() {
      if (!loading) {
        if (session) {
          // User is authenticated, check completion status
          const route = await getUserNavigationRoute();
          setNavigationRoute(route);
        } else {
          // No session, go to landing
          setNavigationRoute("/(auth)/landing");
        }
      }
    }
    determineRoute();
  }, [session, loading]);

  // Show nothing while loading or determining route
  if (loading || !navigationRoute) return null;

  return <Redirect href={navigationRoute as any} />;
}