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

const QUESTION_NUMBER = 1; // Motivation question

const MOTIVATIONS = [
  {
    id: 'prevention',
    answerId: 1,
    emoji: '🌸',
    title: 'To prevent recurring infections',
    explanation: 'I want fewer flare-ups and better prevention.',
  },
  {
    id: 'fertility',
    answerId: 2,
    emoji: '👶',
    title: 'To support fertility and conception',
    explanation: 'I want to track my health while trying to conceive.',
  },
  {
    id: 'stigma',
    answerId: 3,
    emoji: '🤐',
    title: 'To get answers without stigma or judgment',
    explanation: 'I don\'t always feel comfortable asking elsewhere.',
  },
  {
    id: 'complement',
    answerId: 4,
    emoji: '🩺',
    title: 'To complement my gynecologist visits',
    explanation: 'I want support between appointments.',
  },
  {
    id: 'understanding',
    answerId: 5,
    emoji: '✨',
    title: 'To understand my body',
    explanation: 'I\'d like more clarity on my body\'s patterns.',
  },
];

interface AnimatedOptionProps {
  motivation: typeof MOTIVATIONS[0];
  isSelected: boolean;
  onPress: () => void;
}

function AnimatedOption({ motivation, isSelected, onPress }: AnimatedOptionProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSelected) {
      // Opening: Scale with slight bounce
      Animated.spring(scaleAnim, {
        toValue: 1.03,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();

      // Opening: Height with slight bounce
      Animated.spring(heightAnim, {
        toValue: 1,
        friction: 7,
        tension: 60,
        useNativeDriver: false,
      }).start();
    } else {
      // Closing: Instant, no animation
      scaleAnim.setValue(1);
      heightAnim.setValue(0);
    }
  }, [isSelected]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Pressable
        style={({ pressed }) => [
          styles.optionButton,
          isSelected && styles.optionButtonSelected,
          pressed && { opacity: 0.8 }
        ]}
        onPress={onPress}
      >
        <View style={styles.optionContent}>
          <Text style={styles.emoji}>{motivation.emoji}</Text>
          <View style={styles.textContainer}>
            <Text style={[
              styles.optionTitle,
              isSelected && styles.optionTitleSelected
            ]}>
              {motivation.title}
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
                {motivation.explanation}
              </Text>
            </Animated.View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function Motivation() {
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleMotivation = (id: string) => {
    if (selectedMotivations.includes(id)) {
      setSelectedMotivations(selectedMotivations.filter(m => m !== id));
    } else {
      setSelectedMotivations([...selectedMotivations, id]);
    }
  };

  const handleContinue = async () => {
    if (selectedMotivations.length === 0) {
      Alert.alert('Please select at least one option', 'Let us know what brought you to Santelle');
      return;
    }

    setLoading(true);
    try {
      const user = await getUser();
      if (!user) {
        Alert.alert('Error', 'User not found. Please try again.');
        return;
      }

      // Convert selected motivation IDs to answer IDs
      const answerIds = selectedMotivations
        .map(id => MOTIVATIONS.find(m => m.id === id)?.answerId)
        .filter((id): id is number => id !== undefined);

      // Save answers to database (q1 is an array column)
      await saveQuestionnaireAnswer(user.id, QUESTION_NUMBER, answerIds);
      
      // Navigate to next question
      router.push('/(questionnaire)/test-frequency');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.backButton}>
          <Pressable
            style={({ pressed }) => [
              styles.backButtonPressable,
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => router.back()}
          >
            <ArrowLeftIcon size={24} color="#721422" />
          </Pressable>
        </View>

        <View style={styles.skipButton}>
          <Pressable
            style={({ pressed }) => [
              styles.skipButtonPressable,
              pressed && { opacity: 0.7 }
            ]}
            onPress={() => router.push('/(questionnaire)/test-frequency')}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </Pressable>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <LogoCrossIcon 
              size={60}
              color="#721422"
            />
            <Text style={styles.title}>What made you curious about Santelle?</Text>
            <Text style={styles.subtitle}>Select all that apply</Text>
          </View>

          <View style={styles.optionsContainer}>
            {MOTIVATIONS.map((motivation) => (
              <AnimatedOption
                key={motivation.id}
                motivation={motivation}
                isSelected={selectedMotivations.includes(motivation.id)}
                onPress={() => toggleMotivation(motivation.id)}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              (selectedMotivations.length === 0 || loading) && styles.continueButtonDisabled,
              pressed && { opacity: 0.8 }
            ]}
            onPress={handleContinue}
            disabled={selectedMotivations.length === 0 || loading}
          >
            <Text style={[
              styles.continueButtonText,
              (selectedMotivations.length === 0 || loading) && styles.continueButtonTextDisabled
            ]}>
              {loading ? 'Saving...' : 'Continue'}
            </Text>
          </Pressable>
        </View>
      </View>
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
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  skipButtonPressable: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Chunko-Bold',
    marginTop: 10,
    color: '#721422',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#721422',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    padding: 16,
  },
  optionButtonSelected: {
    backgroundColor: '#EF7D88',
    borderColor: '#EF7D88',
    borderWidth: 1.5,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
    lineHeight: 24,
  },
  optionTitleSelected: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  explanation: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#721422',
    marginTop: 6,
    lineHeight: 20,
    opacity: 0.8,
  },
  explanationSelected: {
    color: '#FFFFFF',
    opacity: 0.95,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  continueButton: {
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

