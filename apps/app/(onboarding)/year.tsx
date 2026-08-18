import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { router } from 'expo-router';
import { ScreenBackground } from '@/src/components/layout/ScreenBackground';
import { LogoCrossIcon } from '@/src/components/icons/svg/LogoCrossIcon';
import { ArrowLeftIcon } from '@/src/components/icons/svg/ArrowLeftIcon';
import { useAuthOnboardingTranslations } from '@/src/features/auth/useAuthOnboardingTranslations';
import {
  getUser,
  updateOnboardingResponse
} from '@/src/features/auth/auth.api';

const OPTION_HEIGHT = 44;

export default function BirthDate() {
  const { t } = useAuthOnboardingTranslations();
  const months = t.months.map((label, i) => ({ label, value: i + 1 }));
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100; // 100 years ago
  const maxYear = currentYear - 16; // Must be at least 16 years old

  const years = useMemo(
    () => Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i),
    [maxYear, minYear]
  );

  const [selectedYear, setSelectedYear] = useState<number>(maxYear - 25); // Default to ~25 years old
  const [selectedMonth, setSelectedMonth] = useState<number>(1); // Default to January
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default to 1st
  const [loading, setLoading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const yearListRef = useRef<ScrollView>(null);

  const clampDay = (year: number, month: number, day: number) => {
    const maxDay = new Date(year, month, 0).getDate();
    return Math.max(1, Math.min(day, maxDay));
  };

  const daysInMonth = useMemo(() => {
    const days = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }, [selectedYear, selectedMonth]);

  const selectedDayValue = clampDay(selectedYear, selectedMonth, selectedDay);
  const selectedMonthLabel = months.find((month) => month.value === selectedMonth)?.label ?? '';

  useEffect(() => {
    if (!pickerOpen) return;
    const index = years.indexOf(selectedYear);
    if (index < 0) return;
    requestAnimationFrame(() => {
      yearListRef.current?.scrollTo({ y: index * OPTION_HEIGHT, animated: false });
    });
  }, [pickerOpen, selectedYear, years]);

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    setSelectedDay((prevDay) => clampDay(selectedYear, month, prevDay));
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setSelectedDay((prevDay) => clampDay(year, selectedMonth, prevDay));
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      const user = await getUser();
      if (!user) {
        Alert.alert(t.error, t.userNotFound);
        return;
      }

      const safeDay = clampDay(selectedYear, selectedMonth, selectedDay);
      const dateOfBirth = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;
      const dob = new Date(selectedYear, selectedMonth - 1, safeDay);
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
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${t.month}, ${selectedMonthLabel}`}
              onPress={() => setPickerOpen(true)}
              style={({ pressed }) => [
                styles.pickerContainer,
                styles.monthPicker,
                pressed && styles.fieldPressed
              ]}
            >
              <Text style={styles.pickerLabel}>{t.month}</Text>
              <Text style={styles.fieldValue} numberOfLines={1}>{selectedMonthLabel}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${t.day}, ${selectedDayValue}`}
              onPress={() => setPickerOpen(true)}
              style={({ pressed }) => [
                styles.pickerContainer,
                styles.dayPicker,
                pressed && styles.fieldPressed
              ]}
            >
              <Text style={styles.pickerLabel}>{t.day}</Text>
              <Text style={styles.fieldValue} numberOfLines={1}>{selectedDayValue}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${t.year}, ${selectedYear}`}
              onPress={() => setPickerOpen(true)}
              style={({ pressed }) => [
                styles.pickerContainer,
                styles.yearPicker,
                pressed && styles.fieldPressed
              ]}
            >
              <Text style={styles.pickerLabel}>{t.year}</Text>
              <Text style={styles.fieldValue} numberOfLines={1}>{selectedYear}</Text>
            </Pressable>
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

      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setPickerOpen(false)}
            accessibilityRole="button"
            accessibilityLabel={t.done}
          />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{t.whenBorn}</Text>
              <Pressable
                onPress={() => setPickerOpen(false)}
                hitSlop={12}
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                <Text style={styles.doneText}>{t.done}</Text>
              </Pressable>
            </View>
            <View style={styles.columnsRow}>
              <ScrollView style={styles.monthColumn} showsVerticalScrollIndicator={false}>
                {months.map((month) => (
                  <Pressable
                    key={month.value}
                    onPress={() => handleMonthChange(month.value)}
                    style={({ pressed }) => [
                      styles.option,
                      selectedMonth === month.value && styles.optionSelected,
                      pressed && styles.fieldPressed
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedMonth === month.value && styles.optionTextSelected
                      ]}
                      numberOfLines={1}
                    >
                      {month.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              <ScrollView style={styles.dayColumn} showsVerticalScrollIndicator={false}>
                {daysInMonth.map((day) => (
                  <Pressable
                    key={day}
                    onPress={() => setSelectedDay(day)}
                    style={({ pressed }) => [
                      styles.option,
                      selectedDayValue === day && styles.optionSelected,
                      pressed && styles.fieldPressed
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedDayValue === day && styles.optionTextSelected
                      ]}
                    >
                      {day}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              <ScrollView
                ref={yearListRef}
                style={styles.yearColumn}
                showsVerticalScrollIndicator={false}
              >
                {years.map((year) => (
                  <Pressable
                    key={year}
                    onPress={() => handleYearChange(year)}
                    style={({ pressed }) => [
                      styles.option,
                      selectedYear === year && styles.optionSelected,
                      pressed && styles.fieldPressed
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedYear === year && styles.optionTextSelected
                      ]}
                    >
                      {year}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  monthPicker: {
    flex: 2,
    height: 84,
  },
  dayPicker: {
    flex: 1,
    height: 84,
  },
  yearPicker: {
    flex: 1.5,
    height: 84,
  },
  fieldPressed: {
    opacity: 0.8,
  },
  pickerLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
    textAlign: 'center',
    paddingTop: 8,
    opacity: 0.7,
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
    textAlign: 'center',
    paddingVertical: 10,
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
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(114, 20, 34, 0.25)',
  },
  sheet: {
    backgroundColor: '#FFF7F4',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 34,
    paddingHorizontal: 12,
    maxHeight: '70%',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(114, 20, 34, 0.2)',
    marginTop: 10,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
    flex: 1,
    paddingRight: 12,
  },
  doneText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
    fontWeight: '600',
  },
  columnsRow: {
    flexDirection: 'row',
    height: 280,
    gap: 6,
  },
  monthColumn: {
    flex: 2,
  },
  dayColumn: {
    flex: 1,
  },
  yearColumn: {
    flex: 1.2,
  },
  option: {
    height: OPTION_HEIGHT,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  optionSelected: {
    backgroundColor: 'rgba(114, 20, 34, 0.12)',
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
    textAlign: 'center',
  },
  optionTextSelected: {
    fontFamily: 'Poppins-SemiBold',
  },
});
