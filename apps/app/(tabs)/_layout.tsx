import { Tabs, useRouter } from "expo-router";
import { CustomDockNavbar } from "../../src/components/dock";
import { useEffect } from "react";
import { useAuthStore } from "@/src/features/auth/auth.store";
import { hasActiveSubscriptionOrTrial } from "@/src/features/auth/auth.api";

export default function TabsLayout() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    
    const checkSubscription = async () => {
      if (!isAuthenticated || !user) {
        router.replace('/(auth)/landing');
        return;
      }

      try {
        const hasAccess = await hasActiveSubscriptionOrTrial();
        if (!hasAccess && mounted) {
          router.replace('/(auth)/subscription');
        }
      } catch (error) {
        // On error, redirect to subscription screen for safety
        if (mounted) {
          router.replace('/(auth)/subscription');
        }
      }
    };

    checkSubscription();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user, router]);

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomDockNavbar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Home" }}
      />
      <Tabs.Screen
        name="tests"
        options={{ title: "Tests" }}
      />
      <Tabs.Screen
        name="insights"
        options={{ title: "Insights" }}
      />
      <Tabs.Screen
        name="education"
        options={{ title: "Education" }}
      />
    </Tabs>
  );
}