import React, { useState, useEffect, useRef } from 'react';
import { 
  Alert,
  Animated,
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
import { getUser, saveQuestionnaireAnswer } from '@/src/features/auth/auth.api';
import { useTranslations } from '@/src/i18n';

const QUESTION_NUMBER = 6; // Gynecologist satisfaction question

interface SatisfactionOption {
  id: string;
  answerId: number;
  emoji: string;
  title: string;
  explanation: string;
}

interface AnimatedOptionProps {
  option: SatisfactionOption;
  isSelected: boolean;
  onPress: () => void;
}

function AnimatedOption({ option, isSelected, onPress }: AnimatedOptionProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSelected) {
      Animated.spring(scaleAnim, {
        toValue: 1.03,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();

      Animated.spring(heightAnim, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: false,
      }).start();
    } else {
      scaleAnim.setValue(1);
      heightAnim.setValue(0);
    }
  }, [isSelected]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={({ pressed }) => [
          styles.optionButton,
          isSelected && styles.optionButtonSelected,
          pressed && { opacity: 0.8 }
        ]}
        onPress={onPress}
      >
        <View style={styles.optionContent}>
          <Text style={styles.emoji}>{option.emoji}</Text>
          <View style={styles.textContainer}>
            <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
              {option.title}
            </Text>
            <Animated.View
              style={{
                opacity: heightAnim,
                maxHeight: heightAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 100],
                }),
                overflow: 'hidden',
              }}
            >
              <Text style={[styles.explanation, isSelected && styles.explanationSelected]}>
                {option.explanation}
              </Text>
            </Animated.View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function GynecologistSatisfaction() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslations();
  const options: SatisfactionOption[] = React.useMemo(() => [
    { id: 'very-satisfied', answerId: 1, emoji: '🌸', title: t.gyno1Title, explanation: t.gyno1Explanation },
    { id: 'somewhat-satisfied', answerId: 2, emoji: '🙂', title: t.gyno2Title, explanation: t.gyno2Explanation },
    { id: 'neutral', answerId: 3, emoji: '😐', title: t.gyno3Title, explanation: t.gyno3Explanation },
    { id: 'not-satisfied', answerId: 4, emoji: '😕', title: t.gyno4Title, explanation: t.gyno4Explanation },
    { id: 'no-gynecologist', answerId: 5, emoji: '🚫', title: t.gyno5Title, explanation: t.gyno5Explanation },
  ], [t]);

  const handleContinue = async () => {
    if (!selectedOption) {
      Alert.alert(t.pleaseSelectOption, t.gynoSubtitle);
      return;
    }

    setLoading(true);
    try {
      const user = await getUser();
      if (!user) {
        Alert.alert(t.error, t.userNotFound);
        return;
      }

      const answerId = options.find(o => o.id === selectedOption)?.answerId;
      if (!answerId) return;

      await saveQuestionnaireAnswer(user.id, QUESTION_NUMBER, answerId);
      router.push('/(questionnaire)/emotional-reaction');
    } catch (error: any) {
      Alert.alert(t.error, error.message || t.failedToSave);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.backButton}>
          <Pressable
            style={({ pressed }) => [styles.backButtonPressable, pressed && { opacity: 0.7 }]}
            onPress={() => router.back()}
          >
            <ArrowLeftIcon size={24} color="#721422" />
          </Pressable>
        </View>

        <View style={styles.skipButton}>
          <Pressable
            style={({ pressed }) => [styles.skipButtonPressable, pressed && { opacity: 0.7 }]}
            onPress={() => router.push('/(questionnaire)/emotional-reaction')}
          >
            <Text style={styles.skipButtonText}>{t.skip}</Text>
          </Pressable>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <LogoCrossIcon size={60} color="#721422" />
            <Text style={styles.title}>{t.gynoTitle}</Text>
            <Text style={styles.subtitle}>{t.confidenceSelectOne}</Text>
          </View>

          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <AnimatedOption
                key={option.id}
                option={option}
                isSelected={selectedOption === option.id}
                onPress={() => setSelectedOption(option.id)}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              (!selectedOption || loading) && styles.continueButtonDisabled,
              pressed && { opacity: 0.8 }
            ]}
            onPress={handleContinue}
            disabled={!selectedOption || loading}
          >
            <Text style={[
              styles.continueButtonText,
              (!selectedOption || loading) && styles.continueButtonTextDisabled
            ]}>
              {loading ? t.saving : t.continue}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 1 },
  backButtonPressable: { padding: 8 },
  skipButton: { position: 'absolute', top: 60, right: 20, zIndex: 1 },
  skipButtonPressable: { paddingVertical: 8, paddingHorizontal: 16 },
  skipButtonText: { fontSize: 16, fontFamily: 'Poppins-Medium', color: '#721422' },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 100, paddingBottom: 120, paddingHorizontal: 20 },
  headerSection: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', fontFamily: 'Chunko-Bold', marginTop: 10, color: '#721422', textAlign: 'center', paddingHorizontal: 20 },
  subtitle: { fontSize: 16, color: '#721422', marginTop: 8, textAlign: 'center', fontFamily: 'Poppins-Regular' },
  optionsContainer: { gap: 12 },
  optionButton: { backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.4)', padding: 16 },
  optionButtonSelected: { backgroundColor: '#EF7D88', borderColor: '#EF7D88', borderWidth: 1.5 },
  optionContent: { flexDirection: 'row', alignItems: 'center' },
  emoji: { fontSize: 28, marginRight: 12 },
  textContainer: { flex: 1 },
  optionTitle: { fontSize: 16, fontFamily: 'Poppins-Medium', color: '#721422', lineHeight: 24 },
  optionTitleSelected: { fontFamily: 'Poppins-SemiBold', fontWeight: '600', color: '#FFFFFF' },
  explanation: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#721422', marginTop: 6, lineHeight: 20, opacity: 0.8 },
  explanationSelected: { color: '#FFFFFF', opacity: 0.95 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'transparent', paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10 },
  continueButton: { backgroundColor: '#721422', borderRadius: 10, minHeight: 50, alignItems: 'center', justifyContent: 'center' },
  continueButtonDisabled: { backgroundColor: 'rgba(114, 20, 34, .5)' },
  continueButtonText: { fontSize: 16, fontWeight: '600', fontFamily: 'Poppins-Medium', color: '#FFFFFF' },
  continueButtonTextDisabled: { color: 'rgba(255, 255, 255, .5)' },
});
