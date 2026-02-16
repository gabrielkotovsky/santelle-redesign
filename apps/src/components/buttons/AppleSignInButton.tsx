import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View, Text } from 'react-native';
import { useAuthStore } from '@/src/features/auth/auth.store';
import { AppleIcon } from '@/src/components/icons/svg/AppleIcon';

interface AppleSignInButtonProps {
  onSuccess?: (user: any) => void | Promise<void>;
  onError?: (error: any) => void;
  style?: any;
  disabled?: boolean;
  /** Button label (e.g. for i18n: "Continue with Apple" / "Continuer avec Apple") */
  label?: string;
  /** Label shown while signing in (e.g. "Signing in..." / "Connexion...") */
  loadingLabel?: string;
}

export default function AppleSignInButton({ 
  onSuccess, 
  onError, 
  style, 
  disabled = false,
  label = 'Continue with Apple',
  loadingLabel = 'Signing in...',
}: AppleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const { signInWithApple: authStoreSignIn } = useAuthStore();

  const onApplePress = async () => {
    if (disabled || loading) return;
    
    setLoading(true);
    try {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Haptics may fail on some devices; don't block the main action
      }
      
      // 1) Create raw nonce - Expo's SDK hashes it before sending to Apple
      const rawNonce = Crypto.randomUUID();

      // 2) Ask Apple for credential (pass raw nonce; SDK hashes it internally)
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: rawNonce,
      });

      if (!credential.identityToken) {
        throw new Error('No identityToken returned by Apple');
      }

      // 3) Send token to Supabase (OIDC) via auth store
      await authStoreSignIn(credential.identityToken, rawNonce);

      // Optional: First sign-in may give you name/email — store once
      // credential.fullName?.givenName, credential.fullName?.familyName, credential.email
      
      if (onSuccess) {
        // Get the user from auth store after successful sign-in
        const { user } = useAuthStore.getState();
        await onSuccess(user);
      }

    } catch (e: any) {
      // Handle user cancellations
      if (e.code === 'ERR_CANCELED') {
        return;
      }
      if (__DEV__) {
        console.error('[AppleSignIn]', e?.code, e?.message, e);
      }
      if (onError) {
        onError(e);
      } else {
        Alert.alert('Sign-In Error', 'Failed to sign in with Apple. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.socialButton,
        styles.appleButton,
        style,
        loading && styles.disabled,
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
      ]}
      onPress={onApplePress}
      disabled={disabled || loading}
    >
      <View style={styles.iconColumn}>
        <View style={styles.appleIconContainer}>
          <AppleIcon size={25} color="#FFFFFF" />
        </View>
      </View>
      <View style={styles.textColumn}>
        <Text style={[styles.socialButtonText, styles.appleButtonText]}>
          {loading ? loadingLabel : label}
        </Text>
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
  appleButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  disabled: {
    opacity: 0.6,
  },
  iconColumn: {
    width: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    marginLeft: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleIconContainer: {
    marginTop: -3,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
  },
});
