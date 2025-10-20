// src/utils/splashScreen.ts
import { SplashScreen as ExpoSplashScreen } from 'expo-router';

/**
 * Safely hides the splash screen, handling cases where pageSheet modals
 * create new UIViewController instances that don't have splash screen registration.
 */
export async function safeHideSplashScreen(): Promise<void> {
  try {
    await ExpoSplashScreen.hideAsync();
  } catch (error: any) {
    // Suppress "No native splash screen registered" error that occurs
    // when pageSheet modals create new UIViewController instances on iOS
    if (error?.message?.includes('No native splash screen registered')) {
      console.warn('Splash screen hide failed (modal view controller):', error.message);
    } else {
      // Re-throw other errors as they might be more serious
      throw error;
    }
  }
}
