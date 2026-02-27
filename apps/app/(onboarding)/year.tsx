import React, { useState, useMemo } from 'react';
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
import { useAuthOnboardingTranslations } from '@/src/features/auth/useAuthOnboardingTranslations';
import { 
  getUser, 
  updateOnboardingResponse 
} from '@/src/features/auth/auth.api';

export default function BirthDate() {
  const { t } = useAuthOnboardingTranslations();
  const months = t.months.map((label, i) => ({ label, value: i + 1 }));
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100; // 100 years ago
  const maxYear = currentYear - 16; // Must be at least 16 years old
  
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
  
  const [selectedYear, setSelectedYear] = useState<number>(maxYear - 25); // Default to ~25 years old
  const [selectedMonth, setSelectedMonth] = useState<number>(1); // Default to January
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default to 1st
  const [loading, setLoading] = useState(false);

  // Calculate days in the selected month/year
  const daysInMonth = useMemo(() => {
    const days = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }, [selectedYear, selectedMonth]);

  // Adjust day if it exceeds days in month (use useEffect for side effects, not useMemo)
  React.useEffect(() => {
    if (selectedDay > daysInMonth.length) {
      setSelectedDay(daysInMonth.length);
    }
  }, [daysInMonth.length]);

  const handleContinue = async () => {
    setLoading(true);
    try {
      const user = await getUser();
      if (!user) {
        Alert.alert(t.error, t.userNotFound);
        return;
      }

      const dateOfBirth = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      const dob = new Date(selectedYear, selectedMonth - 1, selectedDay);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (age < 16) {
        Alert.alert(t.ageRestrictionTitle, t.ageRestrictionMessage);
        return;
      }

      await updateOnboardingResponse(user.id, {
        date_of_birth: dateOfBirth
      });
      
      router.push('/(onboarding)/country');
    } catch (error: any) {
      Alert.alert(t.error, error.message || t.failedToSaveDob);
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
          
          <Text style={styles.title}>{t.whenBorn}</Text>
          <Text style={styles.subtitle}>
            {t.personalizeExperience}
          </Text>
          <Text style={styles.optionalText}>
            {t.ageRequirement}
          </Text>

          <View style={styles.pickersRow}>
            <View style={[styles.pickerContainer, styles.monthPicker]}>
              <Text style={styles.pickerLabel}>{t.month}</Text>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {months.map((month) => (
                  <Picker.Item 
                    key={month.value} 
                    label={month.label} 
                    value={month.value} 
                  />
                ))}
              </Picker>
            </View>

            <View style={[styles.pickerContainer, styles.dayPicker]}>
              <Text style={styles.pickerLabel}>{t.day}</Text>
              <Picker
                selectedValue={selectedDay}
                onValueChange={(itemValue) => setSelectedDay(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {daysInMonth.map((day) => (
                  <Picker.Item 
                    key={day} 
                    label={day.toString()} 
                    value={day} 
                  />
                ))}
              </Picker>
            </View>

            <View style={[styles.pickerContainer, styles.yearPicker]}>
              <Text style={styles.pickerLabel}>{t.year}</Text>
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
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.continueButton,
                loading && styles.continueButtonDisabled,
                pressed && { opacity: 0.8 }
              ]}
              onPress={handleContinue}
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
  optionalText: {
    fontSize: 14,
    color: 'rgba(114, 20, 34, 0.6)',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontStyle: 'italic',
  },
  pickersRow: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 6,
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, .9)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#721422',
    overflow: 'visible',
    justifyContent: 'center',
  },
  monthPicker: {
    flex: 2,
    height: 180,
  },
  dayPicker: {
    flex: 1,
    height: 180,
  },
  yearPicker: {
    flex: 1.5,
    height: 180,
  },
  pickerLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
    textAlign: 'center',
    paddingTop: 8,
    opacity: 0.7,
  },
  picker: {
    width: '100%',
    height: 150,
  },
  pickerItem: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    height: 150,
    color: '#721422',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
  },
  continueButton: {
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
