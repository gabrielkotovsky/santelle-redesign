// app/_layout.tsx
import { SplashScreen } from "@/src/components/SplashScreen";
import { AuthHydrator } from "@/src/features/auth/AuthHydrator";
import { initializeAuth } from "@/src/features/auth/auth.store";
import SessionHydrator from "@/src/features/test-session/sessionHydrator";
import { supabase } from "@/src/services/supabase";
import { useFonts } from "expo-font";
import { SplashScreen as ExpoSplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  
  const [loaded] = useFonts({
    "Chunko-Bold": require("../assets/fonts/Chunko-Bold.otf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  const [appReady, setAppReady] = useState(false);
  const [showingSplash, setShowingSplash] = useState(true);
  
  useEffect(() => {
    if (!loaded) return;
    let mounted = true;
    (async () => {
      try {
        // Initialize auth store early
        await initializeAuth();
        
        // only sign in if you set the envs
        //if (process.env.EXPO_PUBLIC_DEV_EMAIL && process.env.EXPO_PUBLIC_DEV_PASSWORD) {
          //await devSignIn();
        //}
        // VERIFY: fetch session and log the user id
        const { data } = await supabase.auth.getSession();
      } catch (e) {
        // Handle dev sign-in error silently
      } finally {
        if (mounted) {
          setAppReady(true);
          ExpoSplashScreen.hideAsync().catch(() => {});
        }
      }
    })();
    return () => { mounted = false; };
  }, [loaded]);

  // Show splash screen for 2 seconds after app is ready
  useEffect(() => {
    if (appReady) {
      const timer = setTimeout(() => {
        setShowingSplash(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [appReady]);

  if (!loaded || !appReady || showingSplash) return <SplashScreen />;

  return (
    <>
    <AuthHydrator />
    <SessionHydrator />
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      <Stack.Screen name="(questionnaire)" options={{ headerShown: false }} />
      <Stack.Screen name="log-test" options={{ headerShown: false }} />
    </Stack>
    </>
  );
}