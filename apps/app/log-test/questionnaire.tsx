// 242 lines

import { ScreenBackground } from "@/src/components/layout/ScreenBackground";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ShrinkableTouchable } from "@/src/components/animations/ShrinkableTouchable";
import { useState } from "react";
import { router } from "expo-router";
import WarningModal from "@/src/components/modals/test-warning";
import { useTestSession } from "@/src/features/test-session/testSession.store";
import { XIcon } from "@/src/components/icons/svg/XIcon";

export default function Questionnaire() {
  const [onPeriod, setOnPeriod] = useState<boolean | null>(null);
  const [hadIntercourse, setHadIntercourse] = useState<boolean | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const { startSession } = useTestSession.getState();
  const handleQuestionnaireSubmit = async () => {
    if (onPeriod === false && hadIntercourse === false) {
      await startSession();
      router.replace('/log-test/context');
    } else {
      setShowWarningModal(true);
    }
  };

  const handleGoBack = () => {
    setShowWarningModal(false);
    router.push('/(tabs)/home');
  };

  const handleContinueAnyway = async () => {
    setShowWarningModal(false);
    await startSession();
    router.replace('/log-test/context');
  };

  const handleClose = () => {
    router.push('/(tabs)/home');
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
      {/* Floating Close Button */}
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <View style={styles.closeButtonCircle}>
          <XIcon size={30} color="#721422" />
        </View>
      </TouchableOpacity>

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
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1000,
  },
  closeButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  questionnaireScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  questionnaireContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  
  questionnaireTitle: {
    fontSize: 28,
    fontFamily: 'Chunko-Bold',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  questionnaireSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  
  questionContainer: {
    width: '100%',
    marginBottom: 30,
  },
  
  questionText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  
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
  
  yesNoButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
  },
  
  submitButton: {
    backgroundColor: '#721422',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  
  submitButtonDisabled: {
    backgroundColor: 'rgba(114, 20, 34, 0.3)',
  },
  
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  
  submitButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});