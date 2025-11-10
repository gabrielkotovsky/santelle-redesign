import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { ScreenBackground } from '@/src/components/layout/ScreenBackground';
import { LogoCrossIcon } from '@/src/components/icons/svg/LogoCrossIcon';
import { signOut } from '@/src/features/auth/auth.api';
import { useAuthStore } from '@/src/features/auth/auth.store';

export default function Subscription() {
  const { signOut: signOutStore } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      await signOutStore();
      router.replace('/(auth)/landing');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <LogoCrossIcon 
            size={60}
            color="#721422"
          />
          <Text style={styles.title}>Subscription Required</Text>
          <Text style={styles.subtitle}>
            You need an active subscription or trial to access Santelle.
          </Text>
          <Text style={styles.description}>
            Subscribe to unlock all features and start tracking your health journey.
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={async () => {
              const url = 'https://santellehealth.com';
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
              } else {
                Alert.alert('Error', 'Unable to open the subscription page.');
              }
            }}
          >
            <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Chunko-Bold',
    marginTop: 20,
    color: '#721422',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonSection: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
  },
  subscribeButton: {
    backgroundColor: '#721422',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  signOutButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#721422',
  },
  signOutButtonText: {
    color: '#721422',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
});

