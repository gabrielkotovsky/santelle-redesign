import { ScreenBackground } from "@/src/components/layout/ScreenBackground";
import { View, Text, StyleSheet } from "react-native";
import { ShrinkableTouchable } from "@/src/components/animations/ShrinkableTouchable";
import { useState } from "react";
import { router } from "expo-router";
import WarningModal from "@/src/components/modals/test-warning";

export default function Questionnaire() {
  const [onPeriod, setOnPeriod] = useState<boolean | null>(null);
  const [hadIntercourse, setHadIntercourse] = useState<boolean | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const handleQuestionnaireSubmit = () => {
    // Navigate to next step in the test process
    console.log('Questionnaire submitted:', { onPeriod, hadIntercourse });
    // You can add navigation logic here
    // router.push('/next-step');
    if (onPeriod === false && hadIntercourse === false) {
      router.push('/log-test/test');
    } else {
      setShowWarningModal(true);
    }
  };

  const handleGoBack = () => {
    setShowWarningModal(false);
    router.push('/(tabs)/home');
  };

  const handleContinueAnyway = () => {
    setShowWarningModal(false);
    router.push('/log-test/test');
  };

  const dynamicStyles = StyleSheet.create({
    questionnaireTitle: {
        color: '#721422',
      },
      questionnaireSubtitle: {
        color: '#721422',
      },
      questionText: {
        color: '#721422',
      },
      yesNoButtonSelected: {
        borderColor: '#721422', 
        backgroundColor: 'rgba(114, 20, 34, 0.1)',
      },
      yesNoButtonTextSelected: {
        color: '#721422',
      },
  });

  return (
    <ScreenBackground>
      <View style={styles.questionnaireScreen}>
        <View style={styles.questionnaireContent}>
          <Text style={[styles.questionnaireTitle, dynamicStyles.questionnaireTitle]}>Before You Begin</Text>
          <Text style={[styles.questionnaireSubtitle, dynamicStyles.questionnaireSubtitle]}>
            Please answer these questions to ensure accurate test results
          </Text>
                
                <View style={styles.questionContainer}>
                  <Text style={[styles.questionText, dynamicStyles.questionText]}>
                    Are you currently on your period?
                  </Text>
                  <View style={styles.yesNoContainer}>
                    <ShrinkableTouchable 
                      style={[
                        styles.yesNoButton,
                        onPeriod === true && dynamicStyles.yesNoButtonSelected
                      ] as any}
                      onPress={() => setOnPeriod(true)}
                    >
                      <Text style={[
                        styles.yesNoButtonText,
                        onPeriod === true && dynamicStyles.yesNoButtonTextSelected
                      ]}>Yes</Text>
                    </ShrinkableTouchable>
                    <ShrinkableTouchable 
                      style={[
                        styles.yesNoButton,
                        onPeriod === false && dynamicStyles.yesNoButtonSelected
                      ] as any}
                      onPress={() => setOnPeriod(false)}
                    >
                      <Text style={[
                        styles.yesNoButtonText,
                        onPeriod === false && dynamicStyles.yesNoButtonTextSelected
                      ]}>No</Text>
                    </ShrinkableTouchable>
                  </View>
                </View>

                <View style={styles.questionContainer}>
                  <Text style={[styles.questionText, dynamicStyles.questionText]}>
                    Have you had sex in the last 24 hours?
                  </Text>
                  <View style={styles.yesNoContainer}>
                    <ShrinkableTouchable 
                      style={[
                        styles.yesNoButton,
                        hadIntercourse === true && dynamicStyles.yesNoButtonSelected
                      ] as any}
                      onPress={() => setHadIntercourse(true)}
                    >
                      <Text style={[
                        styles.yesNoButtonText,
                        hadIntercourse === true && dynamicStyles.yesNoButtonTextSelected
                      ]}>Yes</Text>
                    </ShrinkableTouchable>
                    <ShrinkableTouchable 
                      style={[
                        styles.yesNoButton,
                        hadIntercourse === false && dynamicStyles.yesNoButtonSelected
                      ] as any}
                      onPress={() => setHadIntercourse(false)}
                    >
                      <Text style={[
                        styles.yesNoButtonText,
                        hadIntercourse === false && dynamicStyles.yesNoButtonTextSelected
                      ]}>No</Text>
                    </ShrinkableTouchable>
                  </View>
                </View>

                <ShrinkableTouchable 
                  style={[
                    styles.submitButton,
                    (onPeriod === null || hadIntercourse === null) && styles.submitButtonDisabled
                  ] as any}
                  onPress={handleQuestionnaireSubmit}
                  disabled={onPeriod === null || hadIntercourse === null}
                >
                  <Text style={[
                    styles.submitButtonText,
                    (onPeriod === null || hadIntercourse === null) && styles.submitButtonTextDisabled
                  ]}>Continue</Text>
                </ShrinkableTouchable>
        </View>
      </View>

      {/* Warning Modal */}
      <WarningModal 
        visible={showWarningModal} 
        onGoBack={handleGoBack} 
        onContinueAnyway={handleContinueAnyway} 
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
     /**
   * Main questionnaire screen container
   * Centers content vertically and horizontally
   */
  questionnaireScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  /**
   * Content container for questionnaire
   * Constrains width for better readability
   */
  questionnaireContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  
  /**
   * Main title for questionnaire
   * Uses Chunko-Bold font for emphasis
   */
  questionnaireTitle: {
    fontSize: 28,
    fontFamily: 'Chunko-Bold',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  /**
   * Subtitle text explaining questionnaire purpose
   * Provides context for the questions
   */
  questionnaireSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  
  /**
   * Container for individual questions
   * Full width with bottom margin for spacing
   */
  questionContainer: {
    width: '100%',
    marginBottom: 30,
  },
  
  /**
   * Question text styling
   * Bold, centered text for clarity
   */
  questionText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  /**
   * Container for Yes/No buttons
   * Horizontal layout with gap between buttons
   */
  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  
  /**
   * Individual Yes/No button styling
   * Glassmorphism effect with border
   */
  yesNoButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(114, 20, 34, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 100,
    alignItems: 'center',
  },
  
  /**
   * Yes/No button text styling
   * SemiBold font for emphasis
   */
  yesNoButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
  },
  
  /**
   * Submit button for questionnaire
   * Dark background with white text
   */
  submitButton: {
    backgroundColor: '#721422',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  
  /**
   * Disabled state for submit button
   * Reduced opacity when not all questions answered
   */
  submitButtonDisabled: {
    backgroundColor: 'rgba(114, 20, 34, 0.3)',
  },
  
  /**
   * Submit button text styling
   * White text for contrast
   */
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  
  /**
   * Disabled submit button text
   * Reduced opacity for disabled state
   */
  submitButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});