// 395 lines

import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Text, TouchableOpacity, Alert } from "react-native";
import Animated, { FadeIn, FadeInUp, FadeOut, FadeOutUp, LinearTransition } from "react-native-reanimated";
import { router } from "expo-router";

// Component imports
import { ScreenBackground } from "@/src/components/layout/ScreenBackground";
import ProgressCard from "@/src/components/tests/progress-card";
import StepCard from "@/src/components/steps/step-card";
import ResultSelector from "@/src/components/steps/result-selector";
import PHResultSelector from "@/src/components/steps/pH-result-selector";
import PHTimerCard from "@/src/components/steps/pH-timer-card";
import TestTimerCard from "@/src/components/steps/test-timer-card";
import SmallTimerCard from "@/src/components/steps/small-timer-card";

// SVG imports
import Step0Svg from "@/assets/images/step0.svg";
import Step1Svg from "@/assets/images/step1.svg";
import Step2Svg from "@/assets/images/step2.svg";
import Step3Svg from "@/assets/images/step3.svg";
import Step4Svg from "@/assets/images/step4.svg";

// Service imports
import { scheduleResultsReady, ensureNotifPermission, cancelNotification } from "@/src/services/notifications";

// Store imports
import { useTestSession } from "@/src/features/test-session/testSession.store";
import { getLogBySession } from "@/src/features/test-logs/testLogs.api";

// Constants
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Types
import { SvgProps } from "react-native-svg";

type Step = {
  title: string;
  image?: any;
  SvgImage?: React.FC<SvgProps>;
  description: string[];
};

// Constants
const TEST_STEPS: Step[] = [
  {
    title: "1. Prepare your swab",
    SvgImage: Step0Svg,
    description: [
      "**Wash** your hands thoroughly",
      "**Open** the swab package and carefully peel back the end (as shown in the diagram) to grasp the swab handle and pull it out",
      "**Do not** let the swab tip touch anything"
    ],
  },
  {
    title: "2. Collect your sample",
    SvgImage: Step1Svg,
    description: [
      "**Insert** the swab gently about half an index into your vagina",
      "**Rotate** the swab slowly and evenly against the vaginal wall for 10–15 seconds",
      "**Make sure** vaginal secretions are visible on the swab",
      "**Remove** the swab and do not touch it to any surface"
    ],
  },
  {
    title: "3. Prepare your solution",
    SvgImage: Step2Svg,
    description: [
      "**Insert** the swab into the sample tube (purple) containing diluent",
      "**Swish** it around for 10 seconds",
      "**Let it soak** for about 60 seconds",
      "**Squeeze** the tube walls for a few seconds to extract the sample"
    ],
  },
  {
    title: "4. Add your solution to the wells",
    SvgImage: Step3Svg,
    description: [
      "**Discard** the swab",
      "**Tighten** the sample tube cap",
      "**Remove** the dropper cap",
      "**Add 1 drop** of the solution to each reaction well"
    ],
  },
  {
    title: "5. Log your pH results",
    description: [
      "**Log your pH results**"
    ],
  },
  {
    title: "6. Log your final test results",
    description: [
      "**Log your final test results**"
    ],
  }
];

export default function TestScreen() {
  // ===============================
  // Zustand store hooks
  // ===============================
  const session = useTestSession(s => s.session);
  const storeSetStep = useTestSession(s => s.setStep);
  const storeSetResults = useTestSession(s => s.setResultsReadyAt);
  const storeSetPhResults = useTestSession(s => s.setPhResultsReadyAt);
  const abortSession = useTestSession(s => s.abort);
  const hydrate = useTestSession(s => s.hydrateFromServer);

  // ===============================
  // Component state
  // ===============================
  const totalSteps = TEST_STEPS.length;
  
  // Step management state
  const [currentStep, setCurrentStep] = useState(1); // 1-based for UI
  const [minAllowedStep, setMinAllowedStep] = useState<number>(1);
  const [step3Confirmed, setStep3Confirmed] = useState<boolean>(() => {
    const s = useTestSession.getState().session;
    return (s?.current_step ?? 1) >= 5;
  });
  
  // Timer state
  const [phEndsAt, setPhEndsAt] = useState<string | null>(null);
  const [resultsEndsAt, setResultsEndsAt] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [resultsNotifId, setResultsNotifId] = useState<string | undefined>(undefined);
  
  // pH validation state
  const [phSelected, setPhSelected] = useState<boolean>(false);
  
  // Swipe hint overlay state
  const [showSwipeHint, setShowSwipeHint] = useState<boolean>(true);
  
  // Refs
  const listRef = useRef<FlatList<Step>>(null);
  const programmaticScroll = useRef(false);
  const hasSyncedFromServer = useRef(false);
  
  // ===============================
  // Computed values
  // ===============================
  const phRemaining = phEndsAt ? Math.max(0, new Date(phEndsAt).getTime() - now) : 0;
  const isPHTimerRunning = !!phEndsAt && phRemaining > 0;
  const resultsRemaining = resultsEndsAt ? Math.max(0, new Date(resultsEndsAt).getTime() - now) : 0;
  const isResultsTimerRunning = !!resultsEndsAt && resultsRemaining > 0;

  // ===============================
  // Event handlers and functions
  // ===============================
  const onStepChanged = async (newStep: number) => {
    if (newStep === 5 && !step3Confirmed) {
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: 3, animated: true });
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
      return;
    }

    // Prevent navigation to step 6 without pH selection
    if (newStep === 6 && !phSelected) {
      Alert.alert(
        'pH Required',
        'Please select your pH result before proceeding to final results.',
        [{ text: 'OK' }]
      );
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: 4, animated: true }); // Go back to step 5 (pH)
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
      return;
    }
    
    setCurrentStep(newStep);

    if (newStep === 5) {
      const t = Date.now();
      if (!phEndsAt) 
        setPhEndsAt(new Date(t + 60 * 1000).toISOString());
      if (!resultsEndsAt) 
        setResultsEndsAt(new Date(t + 600 * 1000).toISOString());
      if (session && !phEndsAt) 
        await storeSetPhResults(new Date(t + 60 * 1000).toISOString());
      if (session && !resultsEndsAt) 
        await storeSetResults(new Date(t + 600 * 1000).toISOString());

      try {
        await ensureNotifPermission();
        if (resultsNotifId) await cancelNotification(resultsNotifId);
        const id = await scheduleResultsReady(new Date(t + 600 * 1000).toISOString());
        setResultsNotifId(id);
      } catch (e) {
        // Silently handle notification scheduling error
      }

      if (session) {
        await storeSetStep(newStep);
      }
    }

    if (newStep === 6 && isResultsTimerRunning) {
      goToStep(5);
      return;
    }
  };

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Hide swipe hint on any swipe
    if (showSwipeHint) setShowSwipeHint(false);
    
    if (programmaticScroll.current) return;
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    const step = index + 1;
    if (step === 5 && !step3Confirmed) {
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: 3, animated: true });
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
      return;
    }
    if (step === 6 && !phSelected) {
      Alert.alert(
        'pH Required',
        'Please select your pH result before proceeding to final results.',
        [{ text: 'OK' }]
      );
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: 4, animated: true });
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
      return;
    }
    if (step < minAllowedStep) {
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: minAllowedStep - 1, animated: true });
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
      return;
    }
    if (step !== currentStep) {
      onStepChanged(step);
    }
  };

  // ===============================
  // useEffect hooks
  // ===============================
  // Timer update effect
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Auto-hide swipe hint after 3 seconds
  useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => setShowSwipeHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeHint]);

  // Cancel notification when timer expires
  useEffect(() => {
    if (resultsNotifId && resultsRemaining <= 0) {
      cancelNotification(resultsNotifId);
      setResultsNotifId(undefined);
    }
  }, [resultsRemaining, resultsNotifId]);

  // Hydrate session on mount
  useEffect(() => {
    (async () => {
      if (!session) await hydrate();
    })();
  }, []);

  // Sync with server session data
  useEffect(() => {
    if (!session || !listRef.current) return;
    const step = Math.max(1, Math.min(6, session.current_step || 1));
    setMinAllowedStep(step);
    if (session.ph_result_ready_at && !phEndsAt) {
      setPhEndsAt(session.ph_result_ready_at);
    }
    if (session.results_ready_at && !resultsEndsAt) {
      setResultsEndsAt(session.results_ready_at);
      setCurrentStep(step);
      if (step >= 5) setStep3Confirmed(true);
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: step - 1, animated: false });
        hasSyncedFromServer.current = true;
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
    }
  }, [session, phEndsAt, resultsEndsAt]);

  // Check if pH has been selected - poll periodically when on step 5 or later
  useEffect(() => {
    if (!session?.id || currentStep < 5) return;
    
    let cancelled = false;
    
    const checkPH = async () => {
      try {
        const log = await getLogBySession(session.id);
        if (!cancelled && log?.ph != null) {
          setPhSelected(true);
        } else if (!cancelled) {
          setPhSelected(false);
        }
      } catch (e) {
        // Silently handle pH check error
      }
    };
    
    // Initial check
    checkPH();
    
    // Poll every 2 seconds while on step 5 or later
    const interval = setInterval(checkPH, 2000);
    
    return () => { 
      cancelled = true;
      clearInterval(interval);
    };
  }, [session?.id, currentStep]);

  const goToStep = (index0: number) => {
    const targetStep = index0 + 1;
    const clampedStep = Math.max(minAllowedStep, targetStep);
    const clampedIndex = clampedStep - 1;
    if (clampedIndex !== index0) {
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: clampedIndex, animated: true });
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
    } else {
      listRef.current?.scrollToIndex({ index: clampedIndex, animated: true });
    }
    onStepChanged(clampedStep);
    };

  const handleCancelTest = async () => {
    if (resultsNotifId) {
      await cancelNotification(resultsNotifId);
      setResultsNotifId(undefined);
    }
    await abortSession();
    router.replace('/(tabs)/tests');
  };

  // ===============================
  // Render
  // ===============================
  return (
    <ScreenBackground>
      {/* Progress indicator */}
      <ProgressCard
        currentStep={currentStep}
        totalSteps={totalSteps}
        onCancel={handleCancelTest}
      />

      {/* Divider */}
      <View style={{height: 1, backgroundColor: "rgba(255,255,255,0.3)", marginVertical: 10}} />

      {/* Timer card for results countdown */}
      {isResultsTimerRunning && currentStep < 6 && currentStep > 4 && (
        <Animated.View
          entering={FadeInUp.duration(200)}
          exiting={FadeOutUp.duration(200)}
        >
          <SmallTimerCard timeRemaining={Math.floor(resultsRemaining / 1000)} />
        </Animated.View>
      )}

      {/* Swipeable test steps */}
      <Animated.View layout={LinearTransition.duration(200)} style={{ flex: 1, position: 'relative' }}>
        {/* Swipe hint overlay */}
        {showSwipeHint && currentStep === 1 && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 40,
            }}
            pointerEvents="none"
          >
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 20,
              padding: 24,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 32,
                marginBottom: 12,
              }}>
                ⏮️ ⏭️
              </Text>
              <Text style={{
                fontSize: 18,
                fontFamily: 'Poppins-SemiBold',
                color: '#721422',
                textAlign: 'center',
                marginBottom: 4,
              }}>
                Swipe to navigate
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: '#666',
                textAlign: 'center',
              }}>
                Swipe left or right to move between steps
              </Text>
            </View>
          </Animated.View>
        )}
        
        <FlatList
          ref={listRef}
          data={TEST_STEPS}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item, index }) => (
            <View style={{ width: SCREEN_WIDTH }}>
              {/* Step 4: Add solution to wells - requires confirmation */}
              {index === 3 ? (
                <StepCard 
                  title={item.title} 
                  SvgImage={item.SvgImage}
                  description={item.description}
                  button={
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#721422',
                        borderRadius: 99,
                        paddingVertical: 12,
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        Alert.alert(
                          'Start Results Timer',
                          'Have you added 1 drop of solution to each reaction well?',
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'Yes, Start Timer',
                              style: 'default',
                              onPress: () => {
                                setStep3Confirmed(true);
                                setMinAllowedStep(5);
                                onStepChanged(5);
                                programmaticScroll.current = true;
                                requestAnimationFrame(() => {
                                  listRef.current?.scrollToIndex({ index: 4, animated: true }); // 0-based -> step 5
                                  setTimeout(() => { programmaticScroll.current = false; }, 50);
                                });
                              },
                            },
                          ],
                          { 
                            cancelable: true
                          }
                        );
                      }}
                      accessibilityRole="button"
                      accessibilityLabel="Start Results Timer"
                    >
                      <Text style={{ color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>
                        Start Results Timer
                      </Text>
                    </TouchableOpacity>
                  }
                />
              ) : index === 4 ? (
                /* Step 5: pH results - timer or selector */
                isPHTimerRunning ? (
                  <PHTimerCard 
                    timeRemaining={Math.floor(phRemaining / 1000)}
                    onSkip={async () => {
                      if (resultsNotifId) await cancelNotification(resultsNotifId);
                      setResultsNotifId(undefined);
                      setPhEndsAt(new Date().toISOString())
                    }}
                  />
                ) : (
                  <PHResultSelector 
                    title="5. Log your pH results"
                    SvgImage={Step4Svg}
                  />
                )
              ) : index === 5 ? (
                /* Step 6: Final results - timer or selector */
                isResultsTimerRunning ? (
                  <TestTimerCard 
                    timeRemaining={Math.floor(resultsRemaining / 1000)}
                    onSkip={() => setResultsEndsAt(new Date().toISOString())}
                  />
                ) : (
                  <ResultSelector 
                    title="6. Log your final test results"
                  />
                )
              ) : (
                /* All other steps: standard step card */
                <StepCard title={item.title} SvgImage={item.SvgImage} description={item.description} />
              )}
            </View>
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          windowSize={2}
          maxToRenderPerBatch={1}
          onMomentumScrollEnd={onMomentumEnd}
          onScrollBeginDrag={() => { if (showSwipeHint) setShowSwipeHint(false); }}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          initialScrollIndex={0}
        />
      </Animated.View>
    </ScreenBackground>
  );
}