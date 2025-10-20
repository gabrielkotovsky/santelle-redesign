// app/_layout.tsx
import { SplashScreen } from "@/src/components/SplashScreen";
import { AuthHydrator } from "@/src/features/auth/AuthHydrator";
import { initializeAuth } from "@/src/features/auth/auth.store";
import SessionHydrator from "@/src/features/test-session/sessionHydrator";
import { supabase } from "@/src/services/supabase";
import * as Sentry from '@sentry/react-native';
import { useFonts } from "expo-font";
import { SplashScreen as ExpoSplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

Sentry.init({
  dsn: 'https://1592ae82ed7d327545c16cfbd8e6d30a@o4510220344885248.ingest.de.sentry.io/4510220353142864',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

ExpoSplashScreen.preventAutoHideAsync().catch(() => {});

export default Sentry.wrap(function RootLayout() {
  
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
          // Hide the system splash screen immediately when app is ready
          await ExpoSplashScreen.hideAsync();
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
});