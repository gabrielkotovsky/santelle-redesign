// src/components/modals/ask-santelle-modal.tsx
import { Colors } from '@/src/theme/colors';
import { analyzeTestLog } from '@/src/services/analyze-results';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { ShrinkableTouchable } from '../animations/ShrinkableTouchable';
import { XIcon } from '../icons/svg/XIcon';
import { ScreenBackground } from '../layout/ScreenBackground';

type Props = {
  visible: boolean;
  onClose: () => void;
  log?: {
    id: string;
    ph: number | null;
    h2o2: string | null;
    le: string | null;
    sna: string | null;
    beta_g: string | null;
    nag: string | null;
    created_at?: string;
    analysis?: string | null;
  } | null;
  onMedicalTermPress?: (url: string) => boolean;
};

export default function AskSantelleModal({ visible, onClose, log, onMedicalTermPress }: Props) {
  const [promptStates, setPromptStates] = useState<Record<string, { loading: boolean; response?: string; expanded: boolean }>>({});
  
  // Reset prompt states when modal opens
  React.useEffect(() => {
    if (visible && log) {
      setPromptStates({});
    }
  }, [visible, log?.id]);
  
  if (!log) return null;

  const handlePromptPress = async (promptType: string) => {
    const currentState = promptStates[promptType];
    
    // If this button is already expanded, collapse it
    if (currentState?.expanded) {
      setPromptStates(prev => ({
        ...prev,
        [promptType]: { ...currentState, expanded: false }
      }));
      return;
    }
    
    // If this button already has a response, just toggle expansion
    if (currentState?.response) {
      setPromptStates(prev => ({
        ...prev,
        [promptType]: { ...currentState, expanded: !currentState.expanded }
      }));
      return;
    }
    
    // Close all other expanded buttons first
    const updatedStates = Object.keys(promptStates).reduce((acc, key) => {
      if (key !== promptType && promptStates[key]?.expanded) {
        acc[key] = { ...promptStates[key], expanded: false };
      } else {
        acc[key] = promptStates[key];
      }
      return acc;
    }, {} as typeof promptStates);
    
    // Start loading but don't expand yet
    setPromptStates({
      ...updatedStates,
      [promptType]: { loading: true, expanded: false }
    });
    
    // Handle the first button with analyze-results function
    if (promptType === 'what-results-mean') {
      const startTime = Date.now();
      
      // Check if analysis already exists in the database
      if (log.analysis) {
        // Show loading for minimum 3 seconds, then display existing analysis
        setTimeout(() => {
          setPromptStates(prev => ({
            ...prev,
            [promptType]: { 
              loading: false, 
              response: log.analysis, 
              expanded: true 
            }
          }));
        }, 3000);
      } else {
        // No existing analysis, call the function to generate one
        try {
          const result = await analyzeTestLog(log.id);
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 3000 - elapsedTime);
          
          setTimeout(() => {
            setPromptStates(prev => ({
              ...prev,
              [promptType]: { 
                loading: false, 
                response: result.analysis || 'No analysis available.', 
                expanded: true 
              }
            }));
          }, remainingTime);
        } catch (error) {
          console.error('Error analyzing results:', error);
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 3000 - elapsedTime);
          
          setTimeout(() => {
            setPromptStates(prev => ({
              ...prev,
              [promptType]: { 
                loading: false, 
                response: 'Sorry, there was an error analyzing your results. Please try again later.', 
                expanded: true 
              }
            }));
          }, remainingTime);
        }
      }
    } else {
      // Simulate API call for other buttons - replace with actual Supabase edge function calls
      setTimeout(() => {
        const mockResponses = {
          'contextual-factors': 'Several factors can influence your test results, including recent antibiotic use, hormonal changes, sexual activity, and menstrual cycle timing. These contextual elements can temporarily affect your vaginal microbiome balance.',
          'healthy-environment': 'A healthy vaginal environment typically shows a pH between 3.8-4.5, with abundant lactobacilli producing hydrogen peroxide. This creates a protective barrier against harmful bacteria and maintains optimal vaginal health.',
          'holistic-tips': 'To support your vaginal health, consider probiotics, avoiding douching, wearing breathable cotton underwear, staying hydrated, and managing stress. These holistic approaches can help maintain your natural balance.',
          'cycle-effects': 'Your menstrual cycle can significantly impact test results. Hormonal fluctuations during ovulation, menstruation, and different cycle phases can affect pH levels and bacterial composition, leading to variations in your test outcomes.',
          'compare-last-test': 'Comparing with your previous test results would show trends in your vaginal health over time, helping identify patterns and track improvements or changes in your microbiome balance.',
          'reassurance': 'Your test results are a snapshot of your current vaginal health. Remember that vaginal health can fluctuate naturally, and these results help you understand your body better. If you have concerns, consider discussing them with a healthcare provider.'
        };
        
        const mockResponse = mockResponses[promptType as keyof typeof mockResponses] || `Based on your test results, here's what I found regarding ${promptType.replace('-', ' ')}...`;
        setPromptStates(prev => ({
          ...prev,
          [promptType]: { loading: false, response: mockResponse, expanded: true }
        }));
      }, 3000);
    }
  };

  const renderPromptButton = (promptType: string, emoji: string, text: string) => {
    const state = promptStates[promptType];
    const isLoading = state?.loading || false;
    const response = state?.response;

    return (
      <ShrinkableTouchable 
        key={promptType}
        style={styles.promptButton}
        onPress={() => handlePromptPress(promptType)}
      >
        <Text style={styles.promptText}>{emoji} {text}</Text>
        {isLoading && (
          <LottieView
            source={require('@/assets/animations/Loading.json')}
            autoPlay
            loop
            style={styles.promptLoadingAnimation}
          />
        )}
      </ShrinkableTouchable>
    );
  };

  const renderConversation = () => {
    const conversation = [];
    
    // Add user messages and responses
    Object.entries(promptStates).forEach(([promptType, state]) => {
      if (state.response || state.loading) {
        const promptTexts = {
          'what-results-mean': 'What do my results mean?',
          'contextual-factors': 'What factors can affect these results?',
          'healthy-environment': 'How does a healthy environment look like?',
          'holistic-tips': 'Holistic tips for comfort.',
          'cycle-effects': 'How can my cycle affect these results?',
          'compare-last-test': 'Compare with my last test.',
          'reassurance': 'I need reassurance'
        };
        
        // User message (right side)
        conversation.push(
          <View key={`user-${promptType}`} style={styles.userMessage}>
            <Text style={styles.userMessageText}>{promptTexts[promptType as keyof typeof promptTexts]}</Text>
          </View>
        );
        
        // Assistant response (left side)
        if (state.loading) {
          // Show loading spinner on its own line
          conversation.push(
            <View key={`loading-${promptType}`} style={styles.loadingMessage}>
              <LottieView
                source={require('@/assets/animations/Loading.json')}
                autoPlay
                loop
                style={styles.loadingAnimation}
              />
            </View>
          );
        } else if (state.response) {
          // Show actual response
          conversation.push(
            <View key={`assistant-${promptType}`} style={styles.assistantMessage}>
              <Markdown 
                style={md}
                onLinkPress={onMedicalTermPress}
              >
                {state.response}
              </Markdown>
            </View>
          );
        }
      }
    });
    
    return conversation;
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Status bar feathered blur background - iOS only */}
        {Platform.OS === 'ios' && (
          <MaskedView
            style={styles.statusBarBlurBackground}
            maskElement={
              <LinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)','rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.featherMask}
              />
            }
          >
            <BlurView
              tint="light"
              intensity={50}
              style={[styles.statusBarBlurBackground, {
                backgroundColor: 'rgba(255, 255, 255, 0)',
              }]}
            />
          </MaskedView>
        )}

        {/* Bottom feathered blur background - iOS only */}
        {Platform.OS === 'ios' && (
          <MaskedView
            style={styles.bottomBlurBackground}
            maskElement={
              <LinearGradient
                colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)','rgba(0, 0, 0, 1)','rgba(0, 0, 0,1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.featherMask}
              />
            }
          >
            <BlurView
              tint="light"
              intensity={50}
              style={[styles.bottomBlurBackground, {
                backgroundColor: 'rgba(0, 0, 0, 0)',
              }]}
            />
          </MaskedView>
        )}

        {/* Header Content */}
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.titleText}>Ask Santelle</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <XIcon size={30} color={'#721422'} />
            </TouchableOpacity>
          </View>
        </View>
        
                <ScrollView contentContainerStyle={styles.scroll}>
                  {/* Conversation Messages */}
                  {renderConversation()}
                  
                  {/* Prompt Buttons - only show if no loading states and not already used */}
                  {!Object.values(promptStates).some(state => state.loading) && (
                    <View style={styles.promptGrid}>
                      {!promptStates['what-results-mean']?.response && renderPromptButton('what-results-mean', '🔍', 'What do my results mean?')}
                      {!promptStates['contextual-factors']?.response && renderPromptButton('contextual-factors', '🧩', 'What factors can affect these results?')}
                      {!promptStates['healthy-environment']?.response && renderPromptButton('healthy-environment', '🌿', 'How does a healthy environment look like?')}
                      {!promptStates['holistic-tips']?.response && renderPromptButton('holistic-tips', '☁️', 'Holistic tips for comfort.')}
                      {!promptStates['cycle-effects']?.response && renderPromptButton('cycle-effects', '🌸', 'How can my cycle affect these results?')}
                      {!promptStates['compare-last-test']?.response && renderPromptButton('compare-last-test', '📈', 'Compare with my last test.')}
                      {!promptStates['reassurance']?.response && renderPromptButton('reassurance', '🤍', 'I need reassurance')}
                    </View>
                  )}
                </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: { padding: 0, paddingTop: 80, paddingBottom: 50 },
  statusBarBlurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 1000,
  },
  bottomBlurBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 1000,
  },
  featherMask: {
    flex: 1,
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 30,
    height: 100,
    zIndex: 1001,
  },
  headerLeft: {
    flex: 1,
  },
  titleText: {
    fontFamily: 'Chunko-Bold',
    color: '#721422',
    fontSize: 25,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cancelButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -5,
  },
  promptGrid: {
    gap: 0,
  },
  promptButton: {
    borderRadius: 24,
    backgroundColor: 'rgba(253, 158, 171, 0.3)',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  promptButtonContent: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  promptText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: 'rgb(118, 74, 80)',
    lineHeight: 20,
  },
  promptLoadingAnimation: {
    width: 20,
    height: 20,
  },
  promptResponseContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 8,
  },
  promptLoadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  promptLoadingText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.rush,
    opacity: 0.8,
    marginTop: 8,
  },
  promptResponseContent: {
    paddingTop: 8,
  },

  // Conversation styles
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(253, 158, 171, 0.3)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 4,
    marginHorizontal: 20,
    maxWidth: '80%',
  },
  userMessageText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: 'rgb(118, 74, 80)',
    lineHeight: 20,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    marginVertical: 20,
    marginHorizontal: 20,
    maxWidth: '100%',
  },
  loadingMessage: {
    alignSelf: 'flex-start',
    marginVertical: 10,
    marginHorizontal: 30,
    maxWidth: '80%',
  },
  loadingAnimation: {
    width: 30,
    height: 30,
  },
});

const md = {
  body: {
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    flexWrap: 'wrap',
    marginTop: 0,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 26,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    flexWrap: 'wrap',
    marginTop: 0,
  },
  heading1: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    flexWrap: 'wrap',
  },
  heading2: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 10,
  },
  heading3: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 10,
  },
  strong: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#000000',
    flexWrap: 'wrap',
  },
  em: {
    fontStyle: 'italic',
    fontSize: 15,
    color: '#000000',
    flexWrap: 'wrap',
  },
  link: {
    color: '#4A90E2',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    textDecorationLine: 'none',
    flexWrap: 'wrap',
  },
  list_item: {
    color: '#000000',
    fontSize: 15,
    lineHeight: 26,
    fontFamily: 'Poppins-Regular',
    flexWrap: 'wrap',
    flex: 1,
    marginLeft: 0,
  },
  bullet_list: {
    marginLeft: -5,
    marginBottom: 10,
    marginTop: 0,
  },
  bullet_list_icon: {
    fontSize: 30,
    color: '#000000',
    marginTop: 7.5,
    marginRight: 4,
  },
  ordered_list: {
  },
  ordered_list_icon: {
    fontSize: 15,
    color: '#000000',
  },
  hr: {
    backgroundColor: '#000000',
    opacity: 0.25,
    height: 1,
    marginVertical: 10,
  },
  code_inline: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    paddingVertical: 1,
  },
} as const;
