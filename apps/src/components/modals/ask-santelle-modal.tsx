// src/components/modals/ask-santelle-modal.tsx
import { Colors } from '@/src/theme/colors';
import { analyzeTestLog } from '@/src/services/analyze-results';
import { getHealthyEnvironmentAnalysis } from '@/src/services/healthy-environment';
import { getContextualFactorsAnalysis } from '@/src/services/contextual-factors';
import { getCycleContextAnalysis } from '@/src/services/cycle-context';
import { getGPT5Analysis } from '@/src/services/gpt5-analyze-results';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    test_session_id?: string;
    ph: number | null;
    h2o2: string | null;
    le: string | null;
    sna: string | null;
    beta_g: string | null;
    nag: string | null;
    created_at?: string;
    analysis?: string | null;
    analysis_healthy?: string | null;
    analysis_cycle?: string | null;
    gpt_5_analysis?: any | null;
  } | null;
  onMedicalTermPress?: (url: string) => boolean;
};

// Format GPT-5 analysis into readable markdown
function formatGPT5Analysis(analysis: any): string {
  if (!analysis || typeof analysis !== 'object') {
    return 'No analysis available.';
  }

  const lines: string[] = [];

  // Add biomarker-by-biomarker breakdown
  if (analysis.biomarkers && Array.isArray(analysis.biomarkers)) {
    analysis.biomarkers.forEach((biomarker: any) => {
      const name = biomarker.biomarker?.toUpperCase() || 'Unknown';
      const value = biomarker.value !== null ? biomarker.value : 'Not detected';
      const classification = biomarker.classification || 'unknown';
      
      // Use heading2 (##) which is styled with larger font and custom color
      lines.push(`\n## ${name}: ${value} (${classification})`);
      
      if (biomarker.significance) {
        lines.push(`\n**What it measures:** ${biomarker.significance}`);
      }
      
      if (biomarker.interpretation) {
        lines.push(`\n**Your result:** ${biomarker.interpretation}`);
      }
    });
  }

  return lines.join('\n');
}

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
    // Define which prompts are functional
    const functionalPrompts = ['what-results-mean', 'healthy-environment', 'contextual-factors', 'cycle-effects', 'gpt5-analysis'];
    
    // If this is a non-functional prompt, don't process it
    if (!functionalPrompts.includes(promptType)) {
      return;
    }
    
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
    
    // Handle specific prompts with their respective functions
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
              response: log.analysis || undefined, 
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
    } else if (promptType === 'healthy-environment') {
      const startTime = Date.now();
      
      // Check if healthy environment analysis already exists in the database
      if (log.analysis_healthy) {
        // Show loading for minimum 3 seconds, then display existing analysis
        setTimeout(() => {
          setPromptStates(prev => ({
            ...prev,
            [promptType]: { 
              loading: false, 
              response: log.analysis_healthy || undefined, 
              expanded: true 
            }
          }));
        }, 3000);
      } else {
        // No existing analysis, call the function to generate one
        try {
          const result = await getHealthyEnvironmentAnalysis(log.id);
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 3000 - elapsedTime);
          
          setTimeout(() => {
            setPromptStates(prev => ({
              ...prev,
              [promptType]: { 
                loading: false, 
                response: result.log?.analysis_healthy || 'No healthy environment analysis available.', 
                expanded: true 
              }
            }));
          }, remainingTime);
        } catch (error) {
          console.error('Error getting healthy environment analysis:', error);
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 3000 - elapsedTime);
          
          setTimeout(() => {
            setPromptStates(prev => ({
              ...prev,
              [promptType]: { 
                loading: false, 
                response: 'Sorry, there was an error getting your healthy environment analysis. Please try again later.', 
                expanded: true 
              }
            }));
          }, remainingTime);
        }
      }
    } else if (promptType === 'contextual-factors') {
      const startTime = Date.now();
      
      try {
        const result = await getContextualFactorsAnalysis(log.id);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 3000 - elapsedTime);
        
        setTimeout(() => {
          setPromptStates(prev => ({
            ...prev,
            [promptType]: { 
              loading: false, 
              response: result.analysis || 'No contextual factors analysis available.', 
              expanded: true 
            }
          }));
        }, remainingTime);
      } catch (error) {
        console.error('Error getting contextual factors analysis:', error);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 3000 - elapsedTime);
        
        setTimeout(() => {
          setPromptStates(prev => ({
            ...prev,
            [promptType]: { 
              loading: false, 
              response: 'Sorry, there was an error analyzing contextual factors. Please try again later.', 
              expanded: true 
            }
          }));
        }, remainingTime);
      }
    } else if (promptType === 'cycle-effects') {
      const startTime = Date.now();
      
      // Check if cycle analysis already exists in the database
      if (log.analysis_cycle) {
        // Show loading for minimum 3 seconds, then display existing analysis
        setTimeout(() => {
          setPromptStates(prev => ({
            ...prev,
            [promptType]: { 
              loading: false, 
              response: log.analysis_cycle || undefined, 
              expanded: true 
            }
          }));
        }, 3000);
      } else {
        // No existing analysis, call the function to generate one
        try {
          const result = await getCycleContextAnalysis(log.id);
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 3000 - elapsedTime);
          
          // Use the pre-formatted response from the cycle-context function
          const formattedResponse = result.formatted_response;
          
          setTimeout(() => {
            setPromptStates(prev => ({
              ...prev,
              [promptType]: { 
                loading: false, 
                response: formattedResponse, 
                expanded: true 
              }
            }));
          }, remainingTime);
        } catch (error) {
          console.error('Error getting cycle context analysis:', error);
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 3000 - elapsedTime);
          
          setTimeout(() => {
            setPromptStates(prev => ({
              ...prev,
              [promptType]: { 
                loading: false, 
                response: 'Sorry, there was an error analyzing cycle effects on your results. Please try again later.', 
                expanded: true 
              }
            }));
          }, remainingTime);
        }
      }
    } else if (promptType === 'gpt5-analysis') {
      console.log('[Modal] GPT5 analysis button pressed');
      const startTime = Date.now();
      
      // Use test_session_id if available, otherwise fall back to log.id
      const sessionId = log.test_session_id || log.id;
      console.log('[Modal] log.id:', log.id);
      console.log('[Modal] log.test_session_id:', log.test_session_id);
      console.log('[Modal] Using sessionId:', sessionId);
      
      // Call the edge function (it will handle caching internally)
      try {
        console.log('[Modal] 🔄 Calling getGPT5Analysis...');
        const result = await getGPT5Analysis(sessionId);
        console.log('[Modal] ✅ getGPT5Analysis returned successfully');
        console.log('[Modal] Analysis biomarker count:', result.analysis.biomarkers?.length);
        
        const elapsedTime = Date.now() - startTime;
        console.log('[Modal] Edge function took', elapsedTime, 'ms');
        const remainingTime = Math.max(0, 1500 - elapsedTime); // Minimum 1.5s for UX
        
        // Format the analysis result
        console.log('[Modal] Formatting analysis result...');
        const formatted = formatGPT5Analysis(result.analysis);
        console.log('[Modal] Formatted result length:', formatted.length, 'characters');
        
        setTimeout(() => {
          console.log('[Modal] 📝 Setting state with formatted response');
          setPromptStates(prev => ({
            ...prev,
            [promptType]: { 
              loading: false, 
              response: formatted, 
              expanded: true 
            }
          }));
        }, remainingTime);
      } catch (error) {
        console.error('[Modal] ❌ Error getting GPT-5 analysis:', error);
        console.error('[Modal] Error stack:', error instanceof Error ? error.stack : 'No stack');
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1500 - elapsedTime);
        
        setTimeout(() => {
          console.log('[Modal] Setting error state');
          setPromptStates(prev => ({
            ...prev,
            [promptType]: { 
              loading: false, 
              response: `Sorry, there was an error generating the GPT-5 analysis: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later.`, 
              expanded: true 
            }
          }));
        }, remainingTime);
      }
    } else {
      // Simulate API call for other buttons - replace with actual Supabase edge function calls
      setTimeout(() => {
        const mockResponses = {
          'holistic-tips': 'To support your vaginal health, consider probiotics, avoiding douching, wearing breathable cotton underwear, staying hydrated, and managing stress. These holistic approaches can help maintain your natural balance.',
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

  const renderPromptButton = (promptType: string, emoji: string, text: string, isFunctional: boolean = true) => {
    const state = promptStates[promptType];
    const isLoading = state?.loading || false;
    const response = state?.response;

    const handlePress = () => {
      if (isFunctional) {
        handlePromptPress(promptType);
      } else {
        Alert.alert(
          'Coming Soon',
          'This feature is currently under development and will be available in a future update.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    };

    const buttonStyle = !isFunctional 
      ? { ...styles.promptButton, ...styles.disabledPromptButton }
      : styles.promptButton;

    const textStyle = !isFunctional 
      ? { ...styles.promptText, ...styles.disabledPromptText }
      : styles.promptText;

    return (
      <ShrinkableTouchable 
        key={promptType}
        style={buttonStyle}
        onPress={handlePress}
      >
        <Text style={textStyle}>
          {emoji} {text}
        </Text>
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
    const conversation: React.ReactNode[] = [];
    
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
          'reassurance': 'I need reassurance',
          'gpt5-analysis': 'gpt5_analyze_results'
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
              <View style={styles.assistantContent}>
                <Markdown 
                  style={md}
                  onLinkPress={onMedicalTermPress}
                >
                  {state.response}
                </Markdown>
              </View>
            </View>
          );
          
          // Add disclaimer to every response
          const disclaimer = "⚠️ **Important Medical Disclaimer**: This information is for educational purposes only and is not intended as medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any medical concerns or before making decisions about your health.";
          
          conversation.push(
            <View key={`disclaimer-${promptType}`} style={styles.assistantMessage}>
              <View style={styles.assistantContent}>
                <Markdown 
                  style={md}
                  onLinkPress={onMedicalTermPress}
                >
                  {disclaimer}
                </Markdown>
              </View>
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
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']}
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
                backgroundColor: 'rgba(255, 255, 255, 0)',
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
                      {!promptStates['what-results-mean']?.response && renderPromptButton('what-results-mean', '🔍', 'What do my results mean?', true)}
                      {!promptStates['gpt5-analysis']?.response && renderPromptButton('gpt5-analysis', '🤖', 'gpt5_analyze_results', true)}
                      {!promptStates['contextual-factors']?.response && renderPromptButton('contextual-factors', '🧩', 'What factors can affect these results?', true)}
                      {!promptStates['healthy-environment']?.response && renderPromptButton('healthy-environment', '🌿', 'How does a healthy environment look like?', true)}
                      {!promptStates['holistic-tips']?.response && renderPromptButton('holistic-tips', '☁️', 'Holistic tips for comfort.', false)}
                      {!promptStates['cycle-effects']?.response && renderPromptButton('cycle-effects', '🌸', 'How can my cycle affect these results?', true)}
                      {!promptStates['compare-last-test']?.response && renderPromptButton('compare-last-test', '📈', 'Compare with my last test.', false)}
                      {!promptStates['reassurance']?.response && renderPromptButton('reassurance', '🤍', 'I need reassurance', false)}
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
    height: 40,
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
    marginTop: 20,
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
  disabledPromptButton: {
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    opacity: 0.6,
  },
  disabledPromptText: {
    color: 'rgb(150, 150, 150)',
    opacity: 0.7,
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
    marginVertical: 10,
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
    marginTop: 0,
    marginBottom: 5,
    marginHorizontal: 20,
  },
  assistantContent: {
    backgroundColor: '#F8F9FA',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
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
    marginBottom: 0,
    width: '100%',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    flexWrap: 'wrap',
    marginTop: 0,
    marginBottom: 8,
    width: '100%',
  },
  heading1: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 4,
    width: '100%',
  },
  heading2: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 4,
    width: '100%',
  },
  heading3: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    flexWrap: 'wrap',
    marginTop: 6,
    marginBottom: 3,
    width: '100%',
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
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
    flexWrap: 'wrap',
    flex: 1,
    marginLeft: 0,
    marginBottom: 3,
    width: '100%',
  },
  bullet_list: {
    marginLeft: 0,
    marginBottom: 6,
    marginTop: 0,
    width: '100%',
  },
  bullet_list_icon: {
    fontSize: 16,
    color: '#000000',
    marginTop: 1,
    marginRight: 6,
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
