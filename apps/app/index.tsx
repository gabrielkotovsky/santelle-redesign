// app/index.tsx
import { Redirect } from "expo-router";
import { useSession } from "@/src/features/auth/useSession";
import { getUserNavigationRoute } from "@/src/features/auth/auth.api";
import { useEffect, useState } from "react";
import { SplashScreen } from "@/src/components/SplashScreen";

export default function Index() {
  const { session, loading } = useSession();
  const [navigationRoute, setNavigationRoute] = useState<string | null>(null);

  useEffect(() => {
    async function determineRoute() {
      if (!loading) {
        if (session) {
          try {
            // User is authenticated, check completion status
            const route = await getUserNavigationRoute();
            setNavigationRoute(route);
          } catch (error: any) {
            // If user doesn't exist or any error, go to landing
            setNavigationRoute("/(auth)/landing");
          }
        } else {
          // No session, go to landing
          setNavigationRoute("/(auth)/landing");
        }
      }
    }
    determineRoute();
  }, [session, loading]);

  // Show splash screen while loading or determining route
  if (loading || !navigationRoute) return <SplashScreen />;

  return <Redirect href={navigationRoute as any} />;
}