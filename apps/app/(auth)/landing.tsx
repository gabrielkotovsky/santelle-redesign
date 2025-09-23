import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AppleSignInButton from '@/src/components/buttons/AppleSignInButton';
import EmailSignInButton from '@/src/components/buttons/EmailSignInButton';
import { ScreenBackground } from '@/src/components/layout/ScreenBackground';
import { LogoCrossIcon } from '@/src/components/icons/svg/LogoCrossIcon';
import { Text, View } from 'react-native';

export default function Landing() {
  return (
    <ScreenBackground>
        <View style={styles.headerSection}>
            <View style={{ marginTop: 0 }}>
            <LogoCrossIcon 
                size={60}
                color="#721422"
            />
            </View>
            <Text style={styles.title}>Welcome to Santelle</Text>
            <Text style={styles.subtitle}></Text>
            <EmailSignInButton
              onPress={() => {
                router.push('/email');
              }}
            />
            <AppleSignInButton
        onSuccess={(user) => {
          console.log('✅ Apple sign-in success:', user);
        }}
        onError={(err) => {
          console.error('❌ Apple sign-in error:', err);
        }}
      />
      
        </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Chunko-Bold',
    marginTop: 10,
    color: '#721422',
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
  },
});