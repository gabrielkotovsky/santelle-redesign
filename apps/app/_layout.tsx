// app/_layout.tsx
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { devSignIn } from "@/src/services/devAuth";
import { supabase } from "@/src/services/supabase";
import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({
    "Chunko-Bold": require("../assets/fonts/Chunko-Bold.otf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (!loaded) return;
    let mounted = true;
    (async () => {
      try {
        // only sign in if you set the envs
        if (process.env.EXPO_PUBLIC_DEV_EMAIL && process.env.EXPO_PUBLIC_DEV_PASSWORD) {
          await devSignIn();
        }
        // VERIFY: fetch session and log the user id
        const { data } = await supabase.auth.getSession();
        console.log("Supabase session user:", data.session?.user?.id ?? "none");
      } catch (e) {
        console.warn("Dev sign-in error:", e);
      } finally {
        if (mounted) setBooted(true);
        SplashScreen.hideAsync().catch(() => {});
      }
    })();
    return () => { mounted = false; };
  }, [loaded]);

  if (!loaded || !booted) return null;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(modals)" options={{ headerShown: false }} />
      <Stack.Screen name="log-test" options={{ headerShown: false }} />
    </Stack>
  );
}