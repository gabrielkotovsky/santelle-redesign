import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { GoogleIcon } from '@/src/components/icons/svg/GoogleIcon';
import { useAuthStore } from '@/src/features/auth/auth.store';

interface GoogleSignInButtonProps {
  onSuccess?: (user: any) => void | Promise<void>;
  onError?: (error: any) => void;
  style?: any;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
}

const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

// `@react-native-google-signin/google-signin` is a native module and is NOT
// available inside Expo Go. We lazy-require it so importing this file does
// not crash Expo Go; instead the button will show a helpful alert when tapped.
const isExpoGo = Constants.appOwnership === 'expo';

let cachedGoogleSignin: any = null;
let cachedStatusCodes: any = null;
function loadGoogleSigninModule() {
  if (isExpoGo) return null;
  if (cachedGoogleSignin) return { GoogleSignin: cachedGoogleSignin, statusCodes: cachedStatusCodes };
  try {
    const mod = require('@react-native-google-signin/google-signin');
    cachedGoogleSignin = mod.GoogleSignin;
    cachedStatusCodes = mod.statusCodes;
    return { GoogleSignin: cachedGoogleSignin, statusCodes: cachedStatusCodes };
  } catch {
    return null;
  }
}

let configured = false;
function configureGoogleSignIn() {
  if (configured) return;
  const mod = loadGoogleSigninModule();
  if (!mod) return;
  mod.GoogleSignin.configure({
    iosClientId: IOS_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    offlineAccess: false,
  });
  configured = true;
}

function extractIdToken(signInResult: any): string | null {
  if (!signInResult) return null;
  if (typeof signInResult.idToken === 'string' && signInResult.idToken) {
    return signInResult.idToken;
  }
  if (signInResult.data?.idToken) return signInResult.data.idToken;
  return null;
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  style,
  disabled = false,
  label = 'Continue with Google',
  loadingLabel = 'Signing in...',
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle: authStoreSignInWithGoogle } = useAuthStore();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const onGooglePress = async () => {
    if (disabled || loading) return;

    if (isExpoGo) {
      Alert.alert(
        'Google Sign-In unavailable in Expo Go',
        'Google Sign-In requires a native build (dev client or TestFlight/Production). It will work in any real build.'
      );
      return;
    }

    const mod = loadGoogleSigninModule();
    if (!mod) {
      Alert.alert(
        'Google Sign-In unavailable',
        'The native Google Sign-In module could not be loaded. Run a fresh build with `eas build` or `expo run:ios`.'
      );
      return;
    }
    const { GoogleSignin, statusCodes } = mod;

    setLoading(true);
    try {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Haptics may fail on some devices; don't block sign-in.
      }

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const result = await GoogleSignin.signIn();

      const idToken = extractIdToken(result);
      if (!idToken) {
        throw new Error(
          'No idToken returned by Google. Verify Web Client ID is configured for the native sign-in.'
        );
      }

      await authStoreSignInWithGoogle(idToken);

      if (onSuccess) {
        const { user } = useAuthStore.getState();
        await onSuccess(user);
      }
    } catch (e: any) {
      const code = e?.code;
      if (
        code === statusCodes?.SIGN_IN_CANCELLED ||
        code === statusCodes?.IN_PROGRESS ||
        e?.message === 'Sign in action cancelled'
      ) {
        return;
      }

      if (onError) {
        onError(e);
      } else {
        Alert.alert(
          'Sign-In Error',
          e?.message || 'Failed to sign in with Google. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.socialButton,
        style,
        loading && styles.disabled,
        isExpoGo && styles.disabled,
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
      ]}
      onPress={onGooglePress}
      disabled={disabled || loading}
    >
      <View style={styles.iconColumn}>
        <GoogleIcon size={18} />
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.socialButtonText}>{loading ? loadingLabel : label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  socialButton: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 99,
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: '#721422',
  },
  disabled: {
    opacity: 0.6,
  },
  iconColumn: {
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#721422',
  },
});
