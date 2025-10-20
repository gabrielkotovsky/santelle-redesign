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
import { 
  getUser, 
  getOnboardingResponse, 
  createOnboardingResponse, 
  updateOnboardingResponse 
} from '@/src/features/auth/auth.api';

export default function Name() {
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const user = await getUser();
      if (!user) {
        Alert.alert('Error', 'User not found. Please try again.');
        return;
      }

      // Check if onboarding record exists
      const existingRecord = await getOnboardingResponse(user.id);
      
      if (existingRecord) {
        // Update existing record with display name (don't mark complete yet)
        await updateOnboardingResponse(user.id, {
          display_name: displayName.trim()
        });
      } else {
        // Create new record (onboarding_complete will be false by default)
        await createOnboardingResponse(user.id, displayName.trim());
      }
      
      // Navigate to next onboarding step
      router.push('/(onboarding)/year');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save your name. Please try again.');
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
          
          <Text style={styles.title}>What should we call you?</Text>
          <Text style={styles.subtitle}>
            This is how you&apos;ll appear in the app
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.nameInput}
              placeholder="display name"
              placeholderTextColor="#999999"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus={true}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              (!displayName.trim() || loading) && styles.continueButtonDisabled,
              pressed && { opacity: 0.8 }
            ]}
            onPress={handleContinue}
            disabled={!displayName.trim() || loading}
          >
            <Text style={[
              styles.continueButtonText,
              (!displayName.trim() || loading) && styles.continueButtonTextDisabled
            ]}>
              {loading ? 'Saving...' : 'Continue'}
            </Text>
          </Pressable>
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
  continueButton: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    backgroundColor: '#721422',
    borderRadius: 10,
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

