import React, { useState } from 'react';
import { 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  Pressable, 
  StyleSheet, 
  Text, 
  View
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { ScreenBackground } from '@/src/components/layout/ScreenBackground';
import { LogoCrossIcon } from '@/src/components/icons/svg/LogoCrossIcon';
import { ArrowLeftIcon } from '@/src/components/icons/svg/ArrowLeftIcon';
import { 
  getUser, 
  updateOnboardingResponse 
} from '@/src/features/auth/auth.api';

export default function Year() {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100; // 100 years ago
  const maxYear = currentYear - 16; // Must be at least 16 years old
  
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
  
  const [selectedYear, setSelectedYear] = useState<number>(maxYear - 25); // Default to ~25 years old
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedYear) {
      Alert.alert('Error', 'Please select your year of birth');
      return;
    }

    setLoading(true);
    try {
      const user = await getUser();
      if (!user) {
        Alert.alert('Error', 'User not found. Please try again.');
        return;
      }

      // Save year of birth as a date (January 1st of that year)
      const dateOfBirth = `${selectedYear}-01-01`;
      await updateOnboardingResponse(user.id, {
        date_of_birth: dateOfBirth
      });
      
      // Navigate to next onboarding step (or home for now)
      router.push('/(onboarding)/country');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save your year of birth. Please try again.');
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
          
          <Text style={styles.title}>What year were you born?</Text>
          <Text style={styles.subtitle}>
            This helps us personalize your experience
          </Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {years.map((year) => (
                <Picker.Item 
                  key={year} 
                  label={year.toString()} 
                  value={year} 
                />
              ))}
            </Picker>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              (!selectedYear || loading) && styles.continueButtonDisabled,
              pressed && { opacity: 0.8 }
            ]}
            onPress={handleContinue}
            disabled={!selectedYear || loading}
          >
            <Text style={[
              styles.continueButtonText,
              (!selectedYear || loading) && styles.continueButtonTextDisabled
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
  pickerContainer: {
    width: '85%',
    height: 200,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, .9)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#721422',
    marginTop: 30,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: 200,
  },
  pickerItem: {
    fontSize: 40,
    fontFamily: 'Poppins-Medium',
    height: 200,
    color: '#721422',
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

