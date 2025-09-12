import { Tabs } from "expo-router";
import { CustomDockNavbar } from "../../src/components/dock";

export default function TabsLayout() {
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