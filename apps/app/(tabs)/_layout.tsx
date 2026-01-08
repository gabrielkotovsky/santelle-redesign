import { Tabs, useRouter } from "expo-router";
import { CustomDockNavbar } from "../../src/components/dock";
import { useEffect } from "react";
import { useAuthStore } from "@/src/features/auth/auth.store";

export default function TabsLayout() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/(auth)/landing');
    }
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