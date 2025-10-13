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
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenBackground } from '@/src/components/layout/ScreenBackground';
import { LogoCrossIcon } from '@/src/components/icons/svg/LogoCrossIcon';
import { ArrowLeftIcon } from '@/src/components/icons/svg/ArrowLeftIcon';
import { 
  verifyEmailOtp, 
  requestEmailOtp, 
  getUserNavigationRoute,
  getUser,
  getQuestionnaireEntry,
  createQuestionnaireEntry
} from '@/src/features/auth/auth.api';

export default function OTP() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { email } = useLocalSearchParams<{ email: string }>();

  const handleContinue = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    if (otp.length < 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      if (!email) {
        Alert.alert('Error', 'Email not found. Please try again.');
        return;
      }
      
      // Attempting to verify OTP
      
      const session = await verifyEmailOtp(email, otp);
      
      if (session) {
        // Get the user
        const user = await getUser();
        
        if (user) {
          // Check if questionnaire entry exists, if not create it
          const questionnaireEntry = await getQuestionnaireEntry(user.id);
          if (!questionnaireEntry) {
            await createQuestionnaireEntry(user.id);
          }
        }
        
        // Get the appropriate navigation route based on completion status
        const navigationRoute = await getUserNavigationRoute();
        
        Alert.alert(
          'Success!', 
          'You have been successfully verified.',
          [{ text: 'OK', onPress: () => {
            router.replace(navigationRoute as any);
          }}]
        );
      }
    } catch (error: any) {
      // Handle OTP verification error
      
      let errorMessage = 'Invalid verification code. Please try again.';
      
      if (error.message?.includes('expired')) {
        errorMessage = 'The verification code has expired. Please request a new one.';
      } else if (error.message?.includes('invalid')) {
        errorMessage = 'Invalid verification code. Please check and try again.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      if (!email) {
        Alert.alert('Error', 'Email not found. Please try again.');
        return;
      }
      await requestEmailOtp(email);
      Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    }
  };

  return (
    <ScreenBackground>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.backButton}>
          <Pressable
            style={({ pressed }) => [
              styles.backButtonPressable,
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => {
              router.back();
            }}
          >
            <ArrowLeftIcon size={24} color="#721422" />
          </Pressable>
        </View>

        <View style={styles.headerSection}>
          <View style={{ marginTop: 0 }}>
            <LogoCrossIcon 
              size={60}
              color="#721422"
            />
          </View>
          
          <Text style={styles.title}>Enter verification code</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to your email
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus={true}
              textAlign="center"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              (!otp.trim() || loading || otp.length < 6) && styles.continueButtonDisabled,
              pressed && { opacity: 0.8 }
            ]}
            onPress={handleContinue}
            disabled={!otp.trim() || loading || otp.length < 6}
          >
            <Text style={[
              styles.continueButtonText,
              (!otp.trim() || loading || otp.length < 6) && styles.continueButtonTextDisabled
            ]}>
              {loading ? 'Verifying...' : 'Continue'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.resendButton,
              pressed && { opacity: 0.7 }
            ]}
            onPress={handleResendCode}
          >
            <Text style={styles.resendButtonText}>
              Didn't receive the code? Resend
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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  backButtonPressable: {
    padding: 8,
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
  otpInput: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    minHeight: 50,
    letterSpacing: 8,
  },
  continueButton: {
    position: 'absolute',
    bottom: 80,
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
  resendButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#721422',
    textAlign: 'center',
  },
});
