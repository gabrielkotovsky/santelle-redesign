import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AppleSignInButton from '@/src/components/buttons/AppleSignInButton';
import EmailSignInButton from '@/src/components/buttons/EmailSignInButton';
import { ScreenBackground } from '@/src/components/layout/ScreenBackground';
import { LogoCrossIcon } from '@/src/components/icons/svg/LogoCrossIcon';
import { Text, View } from 'react-native';
import { 
  getUserNavigationRoute,
  getUser,
  getQuestionnaireEntry,
  createQuestionnaireEntry
} from '@/src/features/auth/auth.api';

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
        onSuccess={async (user) => {
          // Small delay to ensure auth state is updated
          setTimeout(async () => {
            try {
              // Get the user
              const currentUser = await getUser();
              
              if (currentUser) {
                // Check if questionnaire entry exists, if not create it
                const questionnaireEntry = await getQuestionnaireEntry(currentUser.id);
                if (!questionnaireEntry) {
                  await createQuestionnaireEntry(currentUser.id);
                }
              }
            } catch (error) {
              // Handle error but continue
            }
            
            // Get the appropriate navigation route
            const navigationRoute = await getUserNavigationRoute();
            router.replace(navigationRoute as any);
          }, 100);
        }}
        onError={(err) => {
          // Handle error silently or show user-friendly message
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