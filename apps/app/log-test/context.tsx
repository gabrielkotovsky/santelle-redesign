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
import { usePretest, type PretestQuestion, type PretestChoice, type UUID } from '@/src/features/pre-test';
import { useTestSession } from '@/src/features/test-session/testSession.store';

// Helper function to get question by slug
const getQuestionBySlug = (questions: PretestQuestion[], slug: string): PretestQuestion | undefined => {
  return questions.find(q => q.slug === slug);
};

interface AnimatedOptionProps {
  option: PretestChoice;
  isSelected: boolean;
  onPress: () => void;
  multiline?: boolean;
}

function AnimatedOption({ option, isSelected, onPress, multiline = false }: AnimatedOptionProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isSelected) {
      Animated.spring(scaleAnim, {
        toValue: 1.02,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(1);
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
        <Text style={[
          styles.optionTitle,
          multiline && styles.optionTitleMultiline,
          isSelected && styles.optionTitleSelected
        ]}>
          {option.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function PreTestQuestions() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const { questions, answers, loading, canSubmit, setSingle, toggleMulti, submit, saveAnswer } = usePretest(1);
  const { session: testSession, startSession } = useTestSession();

  // Ensure we have a test session when component loads
  useEffect(() => {
    if (!testSession?.id) {
      console.log('No test session found, creating one...');
      startSession();
    }
  }, [testSession?.id, startSession]);

  // Simple answer handling (no auto-save)
  const handleSetSingle = (questionId: UUID, choiceId: UUID) => {
    setSingle(questionId, choiceId);
  };

  const handleToggleMulti = (questionId: UUID, choiceId: UUID) => {
    toggleMulti(questionId, choiceId);
  };

  // Helper functions to check if answers exist for questions
  const hasAnswerForQuestion = (questionId: UUID): boolean => {
    return answers.some(a => a.question_id === questionId);
  };

  const isChoiceSelected = (questionId: UUID, choiceId: UUID): boolean => {
    const answer = answers.find(a => a.question_id === questionId);
    if (!answer) return false;
    
    if (answer.type === 'single') {
      return answer.choice_id === choiceId;
    } else if (answer.type === 'multi') {
      return answer.choice_ids.includes(choiceId);
    }
    return false;
  };

  // Helper function to get questions for current page
  const getPageQuestions = (): PretestQuestion[] => {
    // For now, we'll show one question per page
    // You can modify this logic to group questions by page
    if (questions.length === 0) return [];
    
    const startIndex = currentPage;
    const endIndex = Math.min(startIndex + 1, questions.length);
    return questions.slice(startIndex, endIndex);
  };

  const handleContinue = async () => {
    if (isSaving) return; // Prevent double submission
    
    // Get questions for current page
    const pageQuestions = getPageQuestions();
    const requiredQuestions = pageQuestions.filter(q => q.required);
    
    // Check if all required questions are answered
    const unansweredRequired = requiredQuestions.filter(q => !hasAnswerForQuestion(q.id));
    
    if (unansweredRequired.length > 0) {
      const questionTitles = unansweredRequired.map(q => q.prompt).join(', ');
      Alert.alert('Required', `Please answer: ${questionTitles}`);
      return;
    }

    setIsSaving(true);
    
    try {
      // Save answers for current page before proceeding
      if (testSession?.id) {
        const pageAnswers = answers.filter(answer => 
          pageQuestions.some(q => q.id === answer.question_id)
        );
        
        for (const answer of pageAnswers) {
          await saveAnswer(testSession.id, answer);
        }
        console.log('Saved answers for page:', currentPage + 1);
      }

      if (currentPage < questions.length - 1) {
        setCurrentPage(prev => prev + 1);
      } else {
        // All done - proceed to test
        router.replace('/log-test/test');
      }
    } catch (error) {
      console.error('Failed to save page answers:', error);
      Alert.alert(
        'Save Failed', 
        'Failed to save your answers. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    } else {
      router.back();
    }
  };

  const canContinue = () => {
    const pageQuestions = getPageQuestions();
    const requiredQuestions = pageQuestions.filter(q => q.required);
    return requiredQuestions.every(q => hasAnswerForQuestion(q.id));
  };

  const renderPage = () => {
    if (loading) {
      return (
        <View style={styles.headerSection}>
          <LogoCrossIcon size={60} color="#721422" />
          <Text style={styles.title}>Loading questions...</Text>
        </View>
      );
    }

    const pageQuestions = getPageQuestions();
    if (pageQuestions.length === 0) {
      return (
        <View style={styles.headerSection}>
          <LogoCrossIcon size={60} color="#721422" />
          <Text style={styles.title}>No questions available</Text>
          <Text style={styles.subtitle}>
            Please check your database connection and ensure pretest questions are populated.
          </Text>
          <Text style={styles.subtitle}>
            Check the console for debugging information.
          </Text>
        </View>
      );
    }

    return pageQuestions.map((question, index) => (
      <View key={question.id}>
        <View style={styles.headerSection}>
          <LogoCrossIcon size={60} color="#721422" />
          <Text style={styles.title}>{question.prompt}</Text>
          <Text style={styles.subtitle}>
            Page {currentPage + 1} of {questions.length}
            {question.type === 'multi' ? ' • Select all that apply' : ''}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {question.choices.map((choice) => (
            <AnimatedOption
              key={choice.id}
              option={choice}
              isSelected={isChoiceSelected(question.id, choice.id)}
              onPress={() => {
                if (question.type === 'single') {
                  handleSetSingle(question.id, choice.id);
                } else if (question.type === 'multi') {
                  handleToggleMulti(question.id, choice.id);
                }
              }}
              multiline={choice.label.length > 50}
            />
          ))}
        </View>
      </View>
    ));
  };


  if (loading) {
    return (
      <ScreenBackground>
        <View style={styles.container}>
          <View style={styles.backButton}>
            <Pressable
              style={({ pressed }) => [styles.backButtonPressable, pressed && { opacity: 0.7 }]}
              onPress={handleBack}
            >
              <ArrowLeftIcon size={24} color="#721422" />
            </Pressable>
          </View>
          <View style={styles.headerSection}>
            <LogoCrossIcon size={60} color="#721422" />
            <Text style={styles.title}>Loading questions...</Text>
          </View>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.backButton}>
          <Pressable
            style={({ pressed }) => [styles.backButtonPressable, pressed && { opacity: 0.7 }]}
            onPress={handleBack}
          >
            <ArrowLeftIcon size={24} color="#721422" />
          </Pressable>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderPage()}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              (!canContinue() || isSaving) && styles.continueButtonDisabled,
              pressed && { opacity: 0.8 }
            ]}
            onPress={handleContinue}
            disabled={!canContinue() || isSaving}
          >
            <Text style={[
              styles.continueButtonText,
              (!canContinue() || isSaving) && styles.continueButtonTextDisabled
            ]}>
              {isSaving ? 'Saving...' : (currentPage === questions.length - 1 ? 'Start Test' : 'Continue')}
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
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 100, paddingBottom: 120, paddingHorizontal: 20 },
  headerSection: { alignItems: 'center', marginBottom: 30 },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    fontFamily: 'Chunko-Bold', 
    marginTop: 10, 
    color: '#721422', 
    textAlign: 'center', 
    paddingHorizontal: 20 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#721422', 
    marginTop: 8, 
    textAlign: 'center', 
    fontFamily: 'Poppins-Regular' 
  },
  introCopy: {
    fontSize: 15,
    color: '#721422',
    marginBottom: 20,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  sectionSubtitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(114, 20, 34, 0.2)',
    marginVertical: 30,
  },
  optionsContainer: { gap: 12, marginBottom: 20 },
  yesNoContainer: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  optionButton: { 
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    borderRadius: 99, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.4)', 
    padding: 16 
  },
  optionButtonSelected: { 
    backgroundColor: '#EF7D88', 
    borderColor: '#EF7D88', 
    borderWidth: 1.5 
  },
  optionTitle: { 
    fontSize: 16, 
    fontFamily: 'Poppins-Medium', 
    color: '#721422', 
    lineHeight: 24,
    textAlign: 'center',
  },
  optionTitleMultiline: {
    textAlign: 'left',
  },
  optionTitleSelected: { 
    fontFamily: 'Poppins-SemiBold', 
    fontWeight: '600', 
    color: '#FFFFFF' 
  },
  warningBox: {
    backgroundColor: 'rgba(255, 200, 100, 0.3)',
    borderWidth: 2,
    borderColor: '#FF8C00',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  warningText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
    lineHeight: 22,
    textAlign: 'center',
  },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'transparent', 
    paddingHorizontal: 20, 
    paddingBottom: 30, 
    paddingTop: 10 
  },
  continueButton: { 
    backgroundColor: '#721422', 
    borderRadius: 99, 
    minHeight: 56, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  continueButtonDisabled: { 
    backgroundColor: 'rgba(114, 20, 34, .5)' 
  },
  continueButtonText: { 
    fontSize: 16, 
    fontWeight: '600', 
    fontFamily: 'Poppins-Medium', 
    color: '#FFFFFF' 
  },
  continueButtonTextDisabled: { 
    color: 'rgba(255, 255, 255, .5)' 
  },
});

