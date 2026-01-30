import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { MailIcon } from '@/src/components/icons/svg/MailIcon';

interface EmailSignInButtonProps {
  onPress?: () => void | Promise<void>;
  style?: any;
  disabled?: boolean;
  /** Button label (e.g. for i18n: "Continue with Email" / "Continuer avec courriel") */
  label?: string;
}

export default function EmailSignInButton({ 
  onPress, 
  style, 
  disabled = false,
  label = 'Continue with Email',
}: EmailSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (disabled || loading) return;
    
    setLoading(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      if (onPress) {
        await onPress();
      }
    } catch (e: any) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.socialButton,
        styles.emailButton,
        style,
        loading && styles.disabled,
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      <View style={styles.iconColumn}>
        <View style={styles.emailIconContainer}>
          <MailIcon size={20} color="#FFFFFF" />
        </View>
      </View>
      <View style={styles.textColumn}>
        <Text style={[styles.socialButtonText, styles.emailButtonText]}>{label}</Text>
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
  emailButton: {
    backgroundColor: '#721422',
    borderColor: '#721422',
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
  emailIconContainer: {
    marginTop: 0,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  emailButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
  },
});
