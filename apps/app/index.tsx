// app/index.tsx
import { Redirect } from "expo-router";
import { useSession } from "@/src/features/auth/useSession";

export default function Index() {
  const { session, loading } = useSession();
  if (loading) return null;

  return <Redirect href={session ? "/(tabs)/home" : "/(auth)/landing"} />;
}