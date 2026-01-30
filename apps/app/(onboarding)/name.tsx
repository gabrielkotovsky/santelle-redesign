import React, { useState } from 'react';
import { 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  Pressable, 
  StyleSheet, 
  Text, 
  TextInput, 
  View 
} from 'react-native';
import { router } from 'expo-router';
import { ScreenBackground } from '@/src/components/layout/ScreenBackground';
import { LogoCrossIcon } from '@/src/components/icons/svg/LogoCrossIcon';
import { useAuthStore } from '@/src/features/auth/auth.store';
import { useAuthOnboardingTranslations } from '@/src/features/auth/useAuthOnboardingTranslations';
import { 
  getUser, 
  getOnboardingResponse, 
  createOnboardingResponse, 
  updateOnboardingResponse 
} from '@/src/features/auth/auth.api';

export default function Name() {
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useAuthOnboardingTranslations();

  const handleContinue = async (skip: boolean = false) => {
    setLoading(true);
    try {
      const user = await getUser();
      if (!user) {
        Alert.alert(t.error, t.userNotFound);
        return;
      }

      // Check if onboarding record exists
      const existingRecord = await getOnboardingResponse(user.id);
      
      // Use display name if provided, otherwise use a default or empty string
      const nameToSave = (!skip && displayName.trim()) ? displayName.trim() : '';
      
      const storedLanguage = useAuthStore.getState().signUpLanguage;

      if (existingRecord) {
        // Update existing record with display name and language (don't mark complete yet)
        await updateOnboardingResponse(user.id, {
          ...(nameToSave && { display_name: nameToSave }),
          language: storedLanguage,
        });
      } else {
        // Create new record (onboarding_complete will be false by default)
        await createOnboardingResponse(user.id, nameToSave, storedLanguage);
      }
      
      // Navigate to next onboarding step
      router.push('/(onboarding)/year');
    } catch (error: any) {
      Alert.alert(t.error, error.message || t.failedToSaveName);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Back button removed - users can't go back after signup */}

        <View style={styles.headerSection}>
          <View style={{ marginTop: 0 }}>
            <LogoCrossIcon 
              size={60}
              color="#721422"
            />
          </View>
          
          <Text style={styles.title}>{t.whatShouldWeCallYou}</Text>
          <Text style={styles.subtitle}>
            {t.howYouAppear}
          </Text>
          <Text style={styles.optionalText}>
            {t.optionalSkip}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.nameInput}
              placeholder={t.displayNamePlaceholder}
              placeholderTextColor="#999999"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus={true}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.skipButton,
                loading && styles.skipButtonDisabled,
                pressed && { opacity: 0.8 }
              ]}
              onPress={() => handleContinue(true)}
              disabled={loading}
            >
              <Text style={[
                styles.skipButtonText,
                loading && styles.skipButtonTextDisabled
              ]}>
                {t.skip}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                loading && styles.continueButtonDisabled,
                pressed && { opacity: 0.8 }
              ]}
              onPress={() => handleContinue(false)}
              disabled={loading}
            >
              <Text style={[
                styles.continueButtonText,
                loading && styles.continueButtonTextDisabled
              ]}>
                {loading ? t.saving : t.continue}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
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
    color: '#721422',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: 'Poppins-Regular',
  },
  optionalText: {
    fontSize: 14,
    color: 'rgba(114, 20, 34, 0.6)',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontStyle: 'italic',
  },
  inputContainer: {
    width: '85%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, .9)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#721422',
    marginTop: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  nameInput: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#721422',
    minHeight: 50,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 30,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#721422',
  },
  skipButtonDisabled: {
    borderColor: 'rgba(114, 20, 34, .5)',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#721422',
  },
  skipButtonTextDisabled: {
    color: 'rgba(114, 20, 34, .5)',
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#721422',
    borderRadius: 30,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(114, 20, 34, .5)',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: 'rgba(255, 255, 255, .5)',
  },
});

